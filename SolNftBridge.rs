use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Mint, TokenAccount};
use spl_token::instruction::AuthorityType;

declare_id!("EvmNftBridge11111111111111111111111111111111");

#[program]
pub mod evm_nft_bridge {
    use super::*;

    pub fn lock_nft(ctx: Context<LockNft>, token_id: u64, target_chain: Vec<u8>) -> ProgramResult {
        let lock_id = create_lock_id(&ctx.accounts.source_chain, token_id, &ctx.accounts.owner, &target_chain);
        let locked_nft = LockedNft {
            source_chain: *ctx.accounts.source_chain.to_account_info().key,
            token_id,
            owner: *ctx.accounts.owner.to_account_info().key,
            target_chain,
        };

        ctx.accounts.locked_nfts.insert(lock_id, locked_nft);

        Ok(())
    }

    pub fn unlock_nft(ctx: Context<UnlockNft>, lock_id: Vec<u8>) -> ProgramResult {
        let locked_nft = ctx.accounts.locked_nfts.get(&lock_id).ok_or(ErrorCode::InvalidLockId)?;

        let cpi_accounts = token::transfer::Accounts {
            from: ctx.accounts.locked_nft_account.clone(),
            to: ctx.accounts.owner_nft_account.clone(),
            authority: ctx.accounts.authority.clone(),
            token_program: ctx.accounts.token_program.clone(),
        };

        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, locked_nft.token_id)?;

        ctx.accounts.locked_nfts.remove(&lock_id);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct LockNft<'info> {
    #[account(signer)]
    pub owner: AccountInfo<'info>,
    pub source_chain: Account<'info, Mint>,
    #[account(mut)]
    pub owner_nft_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub locked_nft_account: Account<'info, TokenAccount>,
    pub authority: AccountInfo<'info>,
    pub locked_nfts: Account<'info, LockedNfts>,
    #[account("token_program.key == &token::ID")]
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct UnlockNft<'info> {
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub locked_nft_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub owner_nft_account: Account<'info, TokenAccount>,
    pub locked_nfts: Account<'info, LockedNfts>,
    #[account("token_program.key == &token::ID")]
    pub token_program: AccountInfo<'info>,
}

#[account]
pub struct LockedNfts {
    pub locked_nfts: Vec<(Vec<u8>, LockedNft)>,
}

#[derive(Clone, Debug, Eq, PartialEq, BorshSerialize, BorshDeserialize)]
pub struct LockedNft {
    pub source_chain: Pubkey,
    pub token_id: u64,
    pub owner: Pubkey,
    pub target_chain: Vec<u8>,
}

fn create_lock_id(source_chain: &Mint, token_id: u64, owner: &AccountInfo, target_chain: &[u8]) -> Vec<u8> {
    let mut data = Vec::new();
    data.extend_from_slice(source_chain.to_account_info().key.as_ref());
    data.extend_from_slice(&token_id.to_le_bytes());
    data.extend_from_slice(owner.key.as_ref());
    data.extend_from_slice(target_chain);
    let lock_id = hash(&data);
    lock_id.to_bytes().to_vec()
}


