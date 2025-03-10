class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [
            {name: "Bot", message: "Hi, I am a virtual assistant here to answer any questions you may have about MVSR Engineering College."},
            {name: "Bot", message: "Please select one of the options from below."},
            {name: "Bot", message: '<div class="chatbox_contextOptions"><button onclick="sendContextOption(0)">Admissions</button><button onclick="sendContextOption(1)">Placements</button><button onclick="sendContextOption(2)">Industrial Training</button><button onclick="sendContextOption(3)">Facilities</button></div>'}
        ];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        this.updateChatText(chatBox);

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            document.getElementById('circular-sb').style.display = "none"
        } else {
            chatbox.classList.remove('chatbox--active')
            document.getElementById('circular-sb').style.display = ""
        }
    }

    onSendButton(chatbox) {
        document.getElementById("loader").style.display = "";
        var textField = chatbox.querySelector('input');

        textField.setAttribute("disabled",'');
        let text1 = textField.value
        let select= document.querySelector('#select');
        let lang= select.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        this.updateChatText(chatbox)

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1,language:lang }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Bot", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = ''
            document.getElementById("loader").style.display = "none";
            textField.removeAttribute("disabled");

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
            document.getElementById("loader").style.display = "none";
            textField.removeAttribute("disabled");
        });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Bot")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

}


const chatbox = new Chatbox();
chatbox.display();

function sendContextOption(index) {
    let lang= select.value;
    fetch('http://127.0.0.1:5000/options', {
        method: 'POST',
        body: JSON.stringify({ id: index,language:lang }),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(r => r.json())
      .then(r => {
        let msg = { name: "Bot", message: r.message };
        chatbox.messages.push(msg);
        chatbox.updateChatText(document.querySelector('.chatbox__support'))
    }).catch((error) => {
        console.error('Error:', error);
        chatbox.updateChatText(document.querySelector('.chatbox__support'))
    });
}

function showMenu() {
    let language = document.getElementById('select').value
    if(language === "English") {
        chatbox.messages.push({name: "Bot", message: "Please select one of the options from below."})
        chatbox.messages.push({name: "Bot", message: '<div class="chatbox_contextOptions"><button onclick="sendContextOption(0)">Admissions</button><button onclick="sendContextOption(1)">Placements</button><button onclick="sendContextOption(2)">Industrial Training</button><button onclick="sendContextOption(3)">Facilities</button></div>'})
        chatbox.updateChatText(document.querySelector('.chatbox__support'))
    } else if(language === "Telugu") {
        chatbox.messages.push({name: "Bot", message: "దయచేసి దిగువ నుండి ఎంపికలలో ఒకదాన్ని ఎంచుకోండి."})
        chatbox.messages.push({name: "Bot", message: '<div class="chatbox_contextOptions"><button onclick="sendContextOption(0)">ప్రవేశాలు</button><button onclick="sendContextOption(1)">ప్లేస్‌మెంట్స్</button><button onclick="sendContextOption(2)">పారిశ్రామిక శిక్షణ</button><button onclick="sendContextOption(3)">సౌకర్యాలు</button></div>'})
        chatbox.updateChatText(document.querySelector('.chatbox__support'))
    } else if(language === "Hindi") {
        chatbox.messages.push({name: "Bot", message: "कृपया नीचे दिए गए विकल्पों में से एक का चयन करें।"})
        chatbox.messages.push({name: "Bot", message: '<div class="chatbox_contextOptions"><button onclick="sendContextOption(0)">दाखिले</button><button onclick="sendContextOption(1)">प्लेसमेंट</button><button onclick="sendContextOption(2)">औद्योगिक प्रशिक्षण</button><button onclick="sendContextOption(3)">सुविधाएँ</button></div>'})
        chatbox.updateChatText(document.querySelector('.chatbox__support'))
    }
}