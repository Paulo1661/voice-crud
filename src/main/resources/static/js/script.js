let dataChannel;
let peerConnection;
let isWebRTCActive = false;
async function initializeWebRTC() {
    // If WebRTC is already active, return directly
    if (isWebRTCActive) return;
    try {
        // Get ephemeral token from server
        const tokenResponse = await fetch("http://localhost:8080/api/rtc-create-ephemeral-token");
        const data = await tokenResponse.json();
        console.log(data)
        const EPHEMERAL_KEY = data.client_secret.value;

        const pc = new RTCPeerConnection();
        peerConnection=pc;

        // Set up audio playback
        const audioEl = document.createElement('audio');
        audioEl.autoplay = true;
        pc.ontrack = (e) => {
            audioEl.srcObject = e.streams[0];
        };

        // Add local audio track
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // Set up data channel
        const dc = pc.createDataChannel('oai-events');
        dataChannel=dc;
        dc.addEventListener('open', () => {
            console.log('Data channel opened');

            // Listen for server messages (WebRTC)
            dc.addEventListener("message", handleMessage);

            configureTools();
        });

        // Create and send offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const baseUrl = 'https://api.openai.com/v1/realtime';
        const model = 'gpt-4o-realtime-preview-2024-12-17';

        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
            method: 'POST',
            body: offer.sdp,
            headers: {
                Authorization: `Bearer ${EPHEMERAL_KEY}`,
                'Content-Type': 'application/sdp',
            },
        });

        const answer = {
            type: 'answer',
            sdp: await sdpResponse.text(),
        };
        await pc.setRemoteDescription(answer);
        //setIsListening(true);
        isWebRTCActive=true;
    } catch (error) {
        console.error('Failed to initialize WebRTC:', error);
        //setIsListening(false);
    }

}

async function handleMessage(e) {
    const serverEvent = JSON.parse(e.data);
    if (serverEvent.type === "response.done") {
        console.log(serverEvent.response.output[0]);
    }

    if (serverEvent.type === 'response.function_call_arguments.done') {
        const fn = fns[serverEvent.name]; // Get the corresponding function by name
        if (fn !== undefined) {
            console.log(`Calling local function ${serverEvent.name}, parameters ${serverEvent.arguments}`);
            const args = JSON.parse(serverEvent.arguments); // Parse function parameters
            const result = await fn(args); // Call the local function and wait for the result
            console.log('Result', result); // Log the result of the function
            // Send the result of the function execution back to the other party
            const event = {
                type: 'conversation.item.create', // Create conversation item event
                item: {
                    type: 'function_call_output', // Function call output
                    call_id: serverEvent.call_id, // Passed call_id
                    output: JSON.stringify(result), // JSON string of the function execution result
                },
            };
            dataChannel.send(JSON.stringify(event)); // Send the result back to the remote side
        }
    }
}

function configureTools() {
    console.log('Configuring data channel with tools');
    if (!dataChannel) return;
    const event = {
        type: 'session.update',
        session: {
            modalities: ['text', 'audio'],
            tools: [
                {
                    type: 'function', // Tool type is function
                    name: 'changeBackgroundColor', // Function name
                    description: 'Change the background color of the webpage', // Description
                    parameters: { // Parameter description
                        type: 'object',
                        properties: {
                            color: {
                                type: 'string',
                                description: 'Hexadecimal value of the color'
                            }, // Color parameter
                        },
                    },
                },
                {
                    type: 'function',
                    name: 'searchByDescriptionOrCategory',
                    description: 'Search transactions by description or category ignoring cas',
                    parameters: {
                        type: 'object',
                        properties: {
                            keyword: {
                                type: 'string',
                                description: 'The search keyword'
                            },
                        },
                    },
                },
                {
                    type: 'function',
                    name: 'displayTransactionsList',
                    description: 'Displays the list of all transactions',
                },
                {
                    type: 'function',
                    name: 'deleteATransaction',
                    description: 'Delete a transaction with a given id',
                    parameters: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'The id of the transaction to delete'
                            },
                        },
                    },
                },
                {
                    type: 'function',
                    name: 'addATransaction',
                    description: 'add a new transaction',
                    parameters: {
                        type: 'object',
                        properties: {
                            amount: {
                                type: 'number',
                                description: 'The amount of the transaction'
                            },
                            date: {
                                type: 'string',
                                description: 'The date of the transaction using the format yyyy-mm-dd'
                            },
                            category: {
                                type: 'string',
                                description: 'The category of the transaction'
                            },
                            description: {
                                type: 'string',
                                description: 'The description of the transaction'
                            },
                        },
                    },
                },
            ],
        },
    };

    dataChannel.send(JSON.stringify(event));
}

const fns = {
    // search transaction
    searchByDescriptionOrCategory: async ({ keyword }) => {
         console.log(keyword);
        await typeLikeHuman(keyword, "search-input", 150);
        return {success: true, keyword};
    },

    // Change the background color of the webpage
    changeBackgroundColor: ({ color }) => {
        document.body.style.backgroundColor = color; // Change the page's background color
        return { success: true, color, html: document.getElementsByTagName("tbody") }; // Return the changed color
    },

    deleteATransaction: ({ id }) => {
        fetch("http://localhost:3000/transactions/delete/"+id,{ method: 'POST' }).
        then(response=>{
            if (response.redirected) {
                window.location.href = response.url;
            }
        });
        return { success: true };
    },

    displayTransactionsList: () => {
        window.location.href="http://localhost:3000/transactions";
        return { success: true };
    },

    addATransaction: ({amount, date, category, description}) => {
        const transaction = {
            amount: amount,
            date: date,
            category: category,
            description: description
        }
        fetch("http://localhost:3000/transactions/add",{ method: 'POST', body: JSON.stringify(transaction), headers: {
                'Content-Type': 'application/json'
            }, }).
        then(response=>{
            if (response.ok) {
                window.location.href = 'http://localhost:3000/transactions/search?search='+description;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        });
        return { success: true };
    }
};


function stopWebRTC() {
    // If WebRTC is not active, return directly
    if (!isWebRTCActive) return;
    // Stop the received audio tracks
    const tracks = peerConnection.getReceivers().map(receiver => receiver.track);
    tracks.forEach(track => track.stop());
    // Close the data channel and WebRTC connection
    if (dataChannel) dataChannel.close();
    if (peerConnection) peerConnection.close();
    // Reset connection and channel objects
    peerConnection = null;
    dataChannel = null;
    // Mark WebRTC as not active
    isWebRTCActive = false;
}

async function typeLikeHuman(text, elementId, delay = 100) {
    console.log("We start typing...")
    const input = document.getElementById(elementId);
    input.focus();
    input.value = ""; // Réinitialise le champ

    for (let i = 0; i < text.length; i++) {
        input.value += text[i];

        // Déclenche l'événement 'input' (comme si un humain tapait)
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Attends un court délai (simulateur humain)
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Facultatif : déclencher aussi un "change" ou "keyup" si nécessaire
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: "Enter" }));
}