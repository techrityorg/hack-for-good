use linear_sdk::{
    account_info::AccountInfo, 
    entrypoint, 
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    program::{decode_mint_proof, decode_transfer_proof},
};

use linear_sdk::pack::{Pack, Unpack};

use cyberconnect::get_social_graph;

let graph = get_social_graph(accounts[0].key, accounts[2].key);
if !graph.is_connected {
  return Err(ProgramError::Unauthorized);
}

use lit_protocol::{store, load};

let cid = store(location_data);
let location = load(cid);

const MAP_PREFIX: &str = "map";
const LOCATION_PREFIX: &str = "location";

#[derive(Debug, PartialEq, Pack, Unpack)]
struct Location {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    // other fields    
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],   
) -> ProgramResult {

    match instruction_data[0] {
        0 => { // create location
            let location_key = format!("{}-{}", LOCATION_PREFIX, instruction_data[1]);
            
            let location_account = &accounts[0];
            
            let mint_proof = decode_mint_proof(accounts, instruction_data)?;
            mint_proof.verify()?;
            
            let location = Location {
                owner: accounts[1].key,
                name: String::from_utf8(instruction_data[2..].to_vec())?,
                description: String::new(),
            };
            
            location_account.set_pack(&location)?;
            
            msg!("Created location {}", location_key);
        }
        
        1 => { // transfer location
            let location_key = format!("{}-{}", LOCATION_PREFIX, instruction_data[1]);
            
            let location_account = &accounts[0];
            let location = location_account.unpack::<Location>()?;
            
            let transfer_proof = decode_transfer_proof(accounts, instruction_data)?;
            transfer_proof.verify()?;
            
            location.owner = accounts[2].key;
            
            location_account.set_pack(&location)?;
            
            msg!("Transferred location {}", location_key);
        }
        
        2 => { // update location
            let location_key = format!("{}-{}", LOCATION_PREFIX, instruction_data[1]);
            
            let location_account = &accounts[0];
            let mut location = location_account.unpack::<Location>()?;
            
            let update_proof = decode_update_proof(accounts, instruction_data)?;
            update_proof.verify()?;
            
            location.description = String::from_utf8(instruction_data[2..].to_vec())?;
            
            location_account.set_pack(&location)?;
            
            msg!("Updated location {}", location_key);
        }
        
        _ => return Err(ProgramError::InvalidInstructionData),
    }

    Ok(())
}