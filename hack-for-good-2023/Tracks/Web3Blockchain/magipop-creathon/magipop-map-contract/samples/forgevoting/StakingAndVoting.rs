// StakingAndVoting.rs
use linear_sdk::{
    account_info::AccountInfo, 
    entrypoint, 
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
};

use linear_sdk::{
    pack::Pack,
    program::{decode_mint_proof, decode_transfer_proof}
};

use cyberconnect::get_social_influence;

let influence = get_social_influence(voter);
let weight = match influence {
  0..100 => 1, 
  100..500 => 2,
  _ => 3
};

use lit_protocol::{store, load} 

let token_cid = store(token_data);
let votes_cid = store(votes_data);

let token = load(token_cid);
let votes = load(votes_cid);

votes[proposal_id][voter] += weight;
#[derive(Debug, PartialEq, Pack)]
struct Token {
    pub total_supply: u64,
    pub balances: Vec<(Pubkey, u64)>, // (owner, balance)
    pub allowances: Vec<(Pubkey, Pubkey, u64)>, // (owner, spender, allowance)
}

impl Token {
    pub fn mint(&mut self, owner: &Pubkey, amount: u64) {
        self.total_supply += amount;
        self.balances.push((*owner, amount));
    }
    
    pub fn transfer(&mut self, from: &Pubkey, to: &Pubkey, amount: u64) -> ProgramResult {
        if let Some(idx) = self.balances.iter().position(|(addr, _)| addr == from) {
            if self.balances[idx].1 < amount {
                return Err(ProgramError::InsufficientFunds);
            }

            self.balances[idx].1 -= amount;

            if let Some(to_idx) = self.balances.iter().position(|(addr, _)| addr == to) {
                self.balances[to_idx].1 += amount;
            } else {
                self.balances.push((*to, amount));
            }
        } else {
            return Err(ProgramError::InvalidAccountData);
        }

        Ok(())
    }
}

// Implement other token methods

#[derive(Debug, PartialEq, Pack)] 
struct Stake {
    pub voter: Pubkey,
    pub amount: u64,
}

#[derive(Debug, PartialEq, Pack)]
struct Votes {
    pub proposals: Vec<Vec<Stake>>, // proposal_id -> stakes
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo], 
    instruction_data: &[u8],
) -> ProgramResult {
    
    let token_account = &accounts[0];
    let votes_account = &accounts[1];

    match instruction_data[0] {
        0 => { // Initialize
            let mut token = Token::unpack(&token_account.data)?;
            let mint_proof = decode_mint_proof(accounts, instruction_data)?;
            mint_proof.verify()?;

            token.mint(&token_account.key, 1000000);

            token_account.set_pack(&token)?;

            let votes = Votes { proposals: vec![] };
            votes_account.set_pack(&votes)?;

            msg!("Token and Votes initialized!");
        }

        1 => { // Transfer 
            let mut token = token_account.unpack::<Token>()?;

            let transfer_proof = decode_transfer_proof(accounts, instruction_data)?;
            transfer_proof.verify()?;

            token.transfer(&accounts[1].key, &accounts[2].key, 1000)?;

            token_account.set_pack(&token)?;

            msg!("Transferred 1000 tokens!");
        }

        2 => { // Stake
            let token = token_account.unpack::<Token>()?;
            let mut votes = votes_account.unpack::<Votes>()?;

            let stake_proof = decode_stake_proof(accounts, instruction_data)?; 
            stake_proof.verify()?;

            let proposal_id = instruction_data[1] as usize;

            if let Some(balance) = token.balances.iter().find(|(owner, _)| owner == &accounts[1].key) {
                votes.proposals[proposal_id].push(Stake {
                    voter: *accounts[1].key,
                    amount: balance.1, 
                });
            } else {
                return Err(ProgramError::InvalidAccountData);
            }

            votes_account.set_pack(&votes)?;
            
            msg!("Staked votes for proposal {}!", proposal_id);
        }

        _ => return Err(ProgramError::InvalidInstructionData),
    }

    Ok(())
}