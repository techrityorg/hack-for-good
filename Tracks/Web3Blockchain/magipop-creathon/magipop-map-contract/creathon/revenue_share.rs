use linear_sdk::{
    account_info::AccountInfo, 
    entrypoint, 
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

use linear_sdk::program::{decode_mint_proof, decode_transfer_proof};

use cyberconnect::{
    get_social_graph,
};

let graph = get_social_graph(accounts[0].key, accounts[1].key);
if !graph.is_connected || graph.relationship != RelationshipType::Friend {
    return Err(ProgramError::Unauthorized)
}

use lit_protocol::{send_file, receive_file};

let cid = send_file(nft_data, accounts[1].key);
receive_file(cid, accounts[2].key);


#[derive(Debug, PartialEq)] 
struct NFT {
    pub owner: Pubkey,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey, 
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    let command = instruction_data[0];

    match command {
        0 => {
            // Initialize NFT
            let nft_account = &accounts[0]; 
            let nft = NFT {
                owner: *nft_account.key,
            };
            
            let mint_proof = decode_mint_proof(accounts, instruction_data)?;
            mint_proof.verify()?;

            nft_account.set_packed(&nft)?;

            msg!("NFT initialized!");
        }

        1 => {
             // Transfer NFT
             let nft_account = &accounts[0];
             let new_owner_account = &accounts[1];

             let transfer_proof = decode_transfer_proof(accounts, instruction_data)?;
             transfer_proof.verify()?;
             
             let mut nft = nft_account.unpack::<NFT>()?;
             nft.owner = *new_owner_account.key;
             
             nft_account.set_packed(&nft)?;
             
             msg!("NFT transferred!");
        }

        _ => {
            msg!("Invalid instruction");
            return Err(linear_sdk::error::Error::InvalidInstruction.into());
        }
    }

    Ok(())
}