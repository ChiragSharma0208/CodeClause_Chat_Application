const socket=io()
const roomName=document.getElementById('room-name')
const userList=document.getElementById('user')
const chatMessages=document.querySelector('.chat-messages')
const chatForm=document.getElementById("chat-form")

const {username,room} =Qs.parse(location.search,{
    ignoreQueryPrefix:true
})



const outputMessage=(message)=>{
    const div=document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div)
    chatMessages.scrollTop=chatMessages.scrollHeight
}

const outputRoomName=(room)=>{
    roomName.innerText=room

}
 
const outputUsers=(users)=>{
    console.log(users);
    userList.innerHTML=
    `
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `

}

socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
})

socket.on('message',message=>{
    console.log(message);
    outputMessage(message)
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    

    const msg=e.target.elements.msg.value
    socket.emit('chatMessage',msg)

    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
})