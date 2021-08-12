var sendBtn = document.getElementById('sendBtn');
var textBox = document.getElementById('textbox');
var chatContainer = document.getElementById('ChatBot_messages')
var user = {message : ""};
var possibleReponses = [
    {message : "hi", response : "hello"},
    {message : "how are you?", response : "im fine"},
    {message : "do you love chuu?", response : "chuu is my wife"},
    {message : "olivia hye or chuu?", response : "gowon lol"},

]

class InteractiveChatbox {
    constructor(a, b, c) {
        this.args = {
            button: a,
            chatbox: b
        }
        this.icons = c;
        this.state = false; 
    }

    display() {
        const {button, chatbox} = this.args;
        
        button.addEventListener('click', () => this.toggleState(chatbox))
    }

    toggleState(chatbox) {
        this.state = !this.state;
        this.showOrHideChatBox(chatbox, this.args.button);
    }

    showOrHideChatBox(chatbox, button) {
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            this.toggleIcon(true, button);
        } else if (!this.state) {
            chatbox.classList.remove('chatbox--active')
            this.toggleIcon(false, button);
        }
    }

    toggleIcon(state, button) {
        const { isClicked, isNotClicked } = this.icons;
        let b = button.children[0].innerHTML;

        if(state) {
            button.children[0].innerHTML = isClicked; 
        } else if(!state) {
            button.children[0].innerHTML = isNotClicked;
        }
    }
}

function sendMessage(userMessage){
    var ChatContain = document.createElement('div');
    ChatContain.classList.add("messages__item");
    ChatContain.classList.add("messages__item--visitor");
    ChatContain.innerHTML = "<span>" + userMessage + "</span>"
    chatContainer.appendChild(ChatContain);



}

function loading(){
    var responseTimer = document.createElement('div');
    responseTimer.classList.add("messages__item");
    responseTimer.classList.add("messages__item--operator");
    var dots = document.createElement("span");
    dots.classList.add("messages__dot");
    responseTimer.appendChild(dots);
    chatContainer.appendChild(responseTimer);
    setTimeout(() => { responseTimer.remove() }, 1000)


}

function chuuResponse(userMessage){
    var responseMessage = "";

    if (userMessage.length > 1){ //question for bot
        var result = possibleReponses.filter(val=>val.message.includes(userMessage.toLowerCase()))

        if (result.length > 0) {
            responseMessage=result[0].response;

        } else {
            responseMessage = "Please send another message!"
            
        }

    } else {
        responseMessage = "Please send another message!"
        
    }

    var ChatContain = document.createElement('div');
    ChatContain.classList.add("messages__item");
    ChatContain.classList.add("messages__item--operator");
    ChatContain.innerHTML = "<span>" + responseMessage + "</span>"
    setTimeout(() => { loading() }, 1000)
    setTimeout(() => { 
        ChatContain.animate([{easing:"ease-in",opacity:0.0},{opacity:1}],{duration:500})
        chatContainer.appendChild(ChatContain);
    }, 2000)
    



}

sendBtn.addEventListener('click',function(e){
    var userMessage = textBox.value;
    if (!userMessage == ""){
        user.message = userMessage.trim();
        textBox.value = "";
        sendMessage(userMessage.trim());
        chuuResponse(userMessage.trim());
        
    }




});


