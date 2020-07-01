const chatform=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomname=document.getElementById('room-name');
const userlist=document.getElementById('users');
const{
    username,room
}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


const socket=io();

socket.emit('joinroom',{username,room});

socket.on('roomusers',({room,users})=>{
outputRoomName(room);
outputUsers(users);
});
socket.on('message',message=>{
    
    outputMessage(message);

    chatMessages.scrollTop=chatMessages.scrollHeight;
});

chatform.addEventListener('submit',(e)=>{
e.preventDefault();
const msg=e.target.elements.msg.value;
socket.emit('chatMessage',msg);
e.target.elements.msg.value='';
e.target.elements.msg.focus();
});

function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
roomname.innerText=room;
}

function outputUsers(users){
    userlist.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`;
}