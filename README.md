# InheritChain - Protocol
"Securing Digital Legacies, Today and Tomorrow."

## Tagline 
"Inheriting Tomorrow, Securing Today: Your Digital Legacy, Powered by InheritChain"

![Gameplay](https://github.com/samar19/pic-/blob/master/Black%20Orange%20Modern%20Studio%20Logo.png)

## Screencast and Presentation Links
- [YouTube Screencast](https://www.youtube.com/watch?v=RMH2iMOrTck)
- [Presentation Link](https://www.youtube.com/watch?v=RMH2iMOrTck)
- [GitHub Repository](https://github.com/samar19/InheritChain---Protocol)
- [Live Demo](https://client-samar19.vercel.app/)

## Tagline Description:
This tagline reflects the essence of the project, emphasizing the idea of securing digital assets for future generations while also highlighting the role of your protocol in making it possible.

## Project Description:
**Project Proposal: InheritChain Protocol for Dora Grant DAO**

**Project Description:**
Unlocking the Future: Safeguarding Today's Digital Legacy with InheritChain Protocol

"Inheriting Tomorrow, Securing Today: Your Digital Legacy, Powered by InheritChain"

In today's digital era, the value of personal assets extends beyond the tangible, encompassing a realm of digital assets including coins, tokens, and NFTs. Surprisingly, a staggering $20 billion worth of these assets has been rendered inaccessible due to the loss of private keys or the unfortunate passing of individuals. In stark contrast to real-world assets like homes, jewelry, and stocks, which are seamlessly transferred to heirs, digital assets often meet an uncertain fate upon the loss of a private key. The question arises: Why not extend the same legacy principles to safeguarding valuable digital assets such as coins and tokens?

Introducing the transformative power of the **InheritChain Protocol** – an innovative solution with the potential to redefine digital legacies. This protocol is the cornerstone of securing digital assets for the future while honoring their importance in the present.

**InheritChain Protocol: Reinventing Legacy Preservation**

The InheritChain Protocol addresses the critical issue of digital asset loss through a secure Smart Contract framework. With the intuitive DApp interface, users can seamlessly authorize and sign their InheritChain requests. Automation is seamlessly orchestrated through the advanced capabilities of Chainlink, ensuring precise execution of user requests.

Through the InheritChain Protocol, users gain the ability to allocate their digital assets – spanning from wrapped coins to tokens – to their chosen beneficiary or heir's wallet. Remarkably, these assets remain under the control of the user, safeguarded and poised for a seamless transfer to the intended recipient as outlined by the user's directives. The brilliance lies in the simplicity: no sensitive private key is exposed. A straightforward approval and signature of the transaction request is all that is required, encompassing three essential components: Beneficiary Address, Asset Amount, and Time. This crucial information finds a secure repository within the intelligent contract of the InheritChain Protocol.

**Charting a New Era in Legacy Preservation**

The InheritChain Protocol is not just a concept but a groundbreaking innovation poised to revolutionize the concept of digital legacies. It empowers individuals to protect their digital wealth today while securing it for the generations to come.

As part of our commitment to Dora Grant DAO, we propose the integration of the InheritChain Protocol. This cutting-edge solution aligns seamlessly with the DAO's mission of fostering innovation and driving tangible impact. With InheritChain Protocol, Dora Grant DAO can embrace a future where digital assets are preserved, shared, and passed down in a manner that truly reflects their worth.

Join us in harnessing the power of InheritChain Protocol, transforming the digital legacy landscape, and embodying the essence of "Inheriting Tomorrow, Securing Today."

## Smart Contract Explain and Analysis:

![Gameplay]()

The analysis and the business role of the provided **InChainERC20** smart contract:

**Analysis:**

- **Purpose:** The contract's purpose is to facilitate the creation and management of digital wills, enabling users to define conditions for the transfer of their digital assets (ERC20 tokens) to beneficiaries.
- **Data Structures:** The contract employs several data structures such as enums, structs, and mappings to store will-related information, including status, deadline, amount, addresses, and more.
- **Functionalities:**
  - **signWill:** Allows users to create new wills by specifying essential parameters such as token name, deadline, amount, beneficiary's address, and more.
  - **extendWill:** Permits the original testator to extend the deadline of their active will.
  - **stopWill:** Enables the original testator to deactivate an active will.
  - **resumeWill:** Allows the original testator to reactivate a previously deactivated will.
  - **executeWill:** Initiates the execution of an active will, transferring specified amounts of tokens to the beneficiary.
  - **execution:** Automatically initiates the execution of all eligible active wills that have passed their deadline.
  - **checkUpkeep and performUpkeep:** These functions are designed to work with Chainlink's Keepers network, allowing the contract to execute maintenance and periodic checks autonomously.

**Business Role:**

The **InChainERC20** smart contract plays a vital role in achieving the objectives of the InheritChain Protocol:

- **Digital Legacy Management:** The contract allows users to create and manage digital wills, ensuring the smooth transfer of their ERC20 tokens to beneficiaries based on predefined conditions and deadlines.
- **Decentralized Execution:** The contract's logic ensures that the execution of wills is automated and decentralized. Tokens are transferred to beneficiaries according to the specified conditions without requiring intermediaries.
- **Security:** By utilizing blockchain technology, the contract offers a secure and tamper-resistant platform for managing digital legacies. The use of smart contracts minimizes the risk of human errors and disputes.
- **Transparency:** The contract enhances transparency by providing a public ledger of all created wills, their details, and execution status. This transparency fosters trust between testators and beneficiaries.
- **Autonomous Maintenance:** The contract's integration with Chainlink's Keepers network allows for automated maintenance and execution, reducing the need for manual intervention and enhancing efficiency.

In summary, the **InChainERC20** contract serves as the backbone of the InheritChain Protocol, providing the essential infrastructure for users to create, manage, and ensure the secure transfer of their digital assets to future beneficiaries. It leverages blockchain's security and automation capabilities to offer a seamless and transparent solution for preserving and transferring digital legacies.

**What I Did for the Dora Grant DAO Round 4:**

As an active participant in Dora Grant DAO Round 4, I applied the transformative capabilities of the **InheritChain Protocol** to address critical challenges and contribute to the DAO's mission of fostering innovation and tangible impact.

**Problem:**
The problem at hand revolved around the vulnerability of digital legacies, with valuable assets like coins, tokens, and NFTs at risk of being lost due to private key misplacement or the unfortunate passing of their owners. This presented a significant challenge to the preservation of digital wealth and the seamless transfer of assets to intended beneficiaries.

**Solution:**
To address this challenge, I introduced the **InheritChain Protocol**, a groundbreaking solution designed to revolutionize digital legacy preservation. Through this protocol, users gain the power to secure their digital assets for the future while ensuring their accessibility and transferability to beneficiaries. The protocol achieves this by utilizing a secure Smart Contract framework, intuitive DApp interface, and the automation capabilities of Chainlink. Users can authorize and sign InheritChain requests, allowing their digital assets to be seamlessly transferred to chosen beneficiaries at specified times, all while safeguarding their private keys.

**Challenges:**
Implementing the **InheritChain Protocol** within the scope of Dora Grant DAO Round 4 wasn't without its challenges. One notable challenge was ensuring the seamless integration of the protocol with existing project components. This required meticulous attention to detail, an understanding of the protocol's architecture, and effective collaboration with team members. Additionally, managing the complexity of secure Smart Contracts and integrating Chainlink's automation capabilities posed technical challenges that demanded a deep understanding of blockchain technology and smart contract development.

By successfully implementing the **InheritChain Protocol** within Dora Grant DAO Round 4, I tackled these challenges head-on and contributed to the creation of a solution that addresses the problem of digital legacy vulnerability. This innovative approach aligns seamlessly with the DAO's objectives and furthers its mission of driving meaningful impact through technology-driven solutions.

**How it's Made:**

# Technologies Used 
1- JavaScript
2- Solidity
3- HTML
4- CSS

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`
