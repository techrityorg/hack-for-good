import { useState } from 'react';
import OpenAI from 'openai';
import "./verxio-ai.css";
import send_icon from '../assets/send_icon.png'
import { BiBot } from 'react-icons/bi';
import chatbot_logo from '../assets/chatbot_logo.png'
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';

function VerxioAI() {

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_VERXIO_AI_KEY,
        dangerouslyAllowBrowser: true
      });

    const { address } = useAccount()

    function shortenAddress(address) {
        if (address.length !== 42) {
          throw new Error('Invalid Ethereum address length');
        }
        const firstPart = address.slice(0, 2);
        const lastPart = address.slice(-4);
        return `${firstPart}...${lastPart}`;
      }

    const Address = '0x4E9cb3E06EF58Ee29A28311D8f6c40924eD21b64';
    const [chatMessages, setChatMessages] = useState([
        // Initialize your chat messages as needed
        { text: 'How can I help you?', isAI: true },
    ]);


function renderTypewriterText(text) {
    // Access the chatbotConversation element directly using getElementById
    const chatbotConversation = document.getElementById('chatbot-conversation');
    
    if (!chatbotConversation) {
      console.error('chatbot-conversation element not found');
      return;
    }
  
    const newSpeechBubble = document.createElement('div');
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor');
    chatbotConversation.appendChild(newSpeechBubble);
    let i = 0;
    const interval = setInterval(() => {
      newSpeechBubble.textContent += text.slice(i - 1, i);
      if (text.length === i) {
        clearInterval(interval);
        newSpeechBubble.classList.remove('blinking-cursor');
      }
      i++;
      chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }, 50);
  }

  const conversationArr = [
	{ 
        role: 'system',
        content: 'Your name is Verxio AI and you are a useful assistant primaryily answering all questions about the gnosis blockchain, web3 and anything related to blockchain technology.'
    }
]  


async function fetchReply(){
    const response = await openai.chat.completions.create({
        messages: conversationArr,
        model: 'gpt-3.5-turbo',
      });
    
    //   console.log(response.choices[0].message)
      conversationArr.push(response.choices[0].message)
      renderTypewriterText(response.choices[0].message.content)
}

  const [userInput, setUserInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (userInput.trim() === '') {
      return; 
    }
    conversationArr.push({
      role: 'user',
      content: userInput,
    });
    
    setChatMessages([...chatMessages, { text: userInput, isAI: false }]);
    setUserInput('');

    fetchReply()
  };

  return (
    <main>
			<section className="chatbot-container">
				<div className="chatbot-header">
        <img src={chatbot_logo} className="logo" />
          <Link to='/'>
          
           </Link>
					<h1>Verxio AI <BiBot />  </h1>
					<h2>Ask me anything!</h2>
					<p className="supportId">User ID: {shortenAddress(Address)}</p>
				</div>
                <div className="chatbot-conversation-container" id="chatbot-conversation">
                {/* Render AI messages */}
                {chatMessages.map((message, index) => (
                <div
                    key={`message-${index}`}
                    className={`speech ${message.isAI ? 'speech-ai' : 'speech-human'}`}
                >
                    {message.text}
                </div>
                ))}
      </div>
				<form id="form" className="chatbot-input-container" onSubmit={handleSubmit}>
                <input
                    name="user-input"
                    type="text"
                    id="user-input"
                    required
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button id="submit-btn" className="submit-btn" type="submit">
					<img 
					    src={send_icon} 
						className="send-btn-icon"
					/>
					</button>
				</form>
			</section>
		</main>
  );
}

export default VerxioAI;
