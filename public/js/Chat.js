var sendBtn = document.getElementById('sendBtn');
var textBox = document.getElementById('textbox');
var chatContainer = document.getElementById('ChatBot_messages')
var user = {message : ""};
var possibleResponses = [
    {message : "hi", response : "hello"},
    {message : "how are you?", response : "im fine"},
    {message : "do you love chuu?", response : "chuu is my wife"},
    {message : "olivia hye or chuu?", response : "gowon lol"},
    {message : "eat", response : "our restaurant is very nice!"},
    {message : "what would happen if if im rank a", response : "dont come in pls no covid"},
    {message : "what would happen if i i'm im rank B", response : "only 2nd floor"},
    {message : "what would happen if i i'm im rank C", response : "dont waste our time la"},
    {message : "work here", response : "lai pay is 500 only"}

]

var grammar_articles = ["a","an","the"]

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
            chatbox.style.display = "block";
            this.toggleIcon(true, button);
        } else if (!this.state) {
            chatbox.classList.remove('chatbox--active')
            chatbox.style.display = "none";
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

textBox.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     document.getElementById("sendBtn").click();
    }
  });

function sendMessage(userMessage){
    var ChatContain = document.createElement('div');
    ChatContain.classList.add("messages__item");
    ChatContain.classList.add("messages__item--operator");
    ChatContain.innerHTML = "<span>" + userMessage + "</span>"
    chatContainer.appendChild(ChatContain);
    document.getElementById("test").scrollTop = document.getElementById("test").scrollHeight;



}

function loading(){
    var responseTimer = document.createElement('div');
    responseTimer.classList.add("messages__item");
    responseTimer.classList.add("messages__item--typing");
    var dots = document.createElement("span");
    dots.classList.add("messages__dot");
    responseTimer.appendChild(dots);
    chatContainer.appendChild(responseTimer);
    setTimeout(() => { responseTimer.remove() }, 1000)


}

function chuuResponse(userMessage){
    var responseMessage = "";

    if (userMessage.length > 1 ){ //question for bot
        var result = possibleResponses.filter(keyword=>keyword.message.toLowerCase().includes(userMessage.toLowerCase()))
        console.log(result);

        if (result.length > 0) {
            responseMessage=result[0].response;

        } else {
            responseMessage = "Hi! Please enter your question and I will do my best to help you!"
            
        }

    } else {
        responseMessage = "Maybe I had misunderstood your question. Please rephrase and try again."
        
    }

    var ChatContain = document.createElement('div');
    ChatContain.classList.add("messages__item");
    ChatContain.classList.add("messages__item--visitor");
    ChatContain.innerHTML = "<span>" + responseMessage + "</span>"
    setTimeout(() => { loading() }, 1000)
    setTimeout(() => { 
        ChatContain.animate([{easing:"ease-in",opacity:0.0},{opacity:1}],{duration:500})
        chatContainer.appendChild(ChatContain);
        document.getElementById("test").scrollTop = document.getElementById("test").scrollHeight;
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


