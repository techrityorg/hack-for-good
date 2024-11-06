use cyberconnect::{
    get_social_graph, 
    get_user_info,
};

let caller = get_user_info(accounts[1].key)?;
let is_admin = get_social_graph(creathon.owner, caller)
    .relationship == RelationshipType::Owner;

if !is_admin {
    return Err(ProgramError::Unauthorized); 
}

use linera_sdk::{
    *, 
    account::Account,
    entrypoint, 
    entrypoint::ProgramResult,
    msg,
};

use lit_protocol::{store, load};

let cid = store(accounts[1].data); 
let content = load(cid);

#[state]
pub struct Creathon {
    pub owner: Account,
}

#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub enum CreathonInstruction {
    Initialize {
        owner: Account,
    },
    SubmitWork {
        user: Account, 
    },
    DistributeRewards {
        user: Account,
    },
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo], 
    instruction_data: &[u8],
) -> ProgramResult {

    let instruction = CreathonInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        CreathonInstruction::Initialize { owner } => {
            let creathon_account = accounts.get(0).ok_or(ProgramError::InvalidAccountData)?;
            let creathon = Creathon::initialize(owner);
            creathon.save(creathon_account)?;
            msg!("Creathon initialized!");
            Ok(())
        }
        CreathonInstruction::SubmitWork { user } => {
           let creathon_account = accounts.get(0).ok_or(ProgramError::InvalidAccountData)?;
           let creathon = Creathon::load(creathon_account)?;
           // Additional logic to submit work
           msg!("Work submitted!");
           Ok(())  
        }
        CreathonInstruction::DistributeRewards { user } => {
            let creathon_account = accounts.get(0).ok_or(ProgramError::InvalidAccountData)?;
            let creathon = Creathon::load(creathon_account)?;
            // Additional logic to distribute rewards
            msg!("Rewards distributed!");
            Ok(())
        }
    }
}