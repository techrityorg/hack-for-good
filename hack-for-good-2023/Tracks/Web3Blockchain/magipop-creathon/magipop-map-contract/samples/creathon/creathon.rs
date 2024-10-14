use linera_sdk::{
    *, 
    account::Account,
    entrypoint, 
    entrypoint::ProgramResult,
    msg,
};

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