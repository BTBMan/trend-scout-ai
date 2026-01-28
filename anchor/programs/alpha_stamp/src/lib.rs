use anchor_lang::prelude::*;

declare_id!("7Qwx9iy2v3tx8spg8NK3x7P8ERUBo4kjkfM5ZMh8h3S"); // Placeholder, will update after deployment or keys list

#[program]
pub mod alpha_stamp {
    use super::*;

    pub fn stamp_alpha(
        ctx: Context<StampAlpha>,
        url: String,
        score: u8,
        _url_seed: [u8; 32],
    ) -> Result<()> {
        let alpha_stamp = &mut ctx.accounts.alpha_stamp;
        let clock = Clock::get()?;

        if score > 100 {
            return err!(ErrorCode::InvalidScore);
        }

        if url.len() > 100 {
            return err!(ErrorCode::UrlTooLong);
        }

        // Verify the seed matches the URL (integrity check)
        let computed_hash = url_hash(&url);
        if computed_hash != _url_seed {
            return err!(ErrorCode::InvalidUrlHash);
        }

        alpha_stamp.finder = ctx.accounts.finder.key();
        alpha_stamp.url = url;
        alpha_stamp.score = score;
        alpha_stamp.timestamp = clock.unix_timestamp;

        msg!("Alpha Stamped! URL: {}, Score: {}", alpha_stamp.url, score);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(url: String, score: u8, url_seed: [u8; 32])]
pub struct StampAlpha<'info> {
    #[account(mut)]
    pub finder: Signer<'info>,

    #[account(
        init,
        payer = finder,
        space = 8 + 32 + 4 + 100 + 1 + 8, // discriminator + pubkey + string prefix + content + u8 + i64
        seeds = [b"alpha", finder.key().as_ref(), url_seed.as_ref()],
        bump
    )]
    pub alpha_stamp: Account<'info, AlphaStamp>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct AlphaStamp {
    pub finder: Pubkey,
    pub url: String,
    pub score: u8,
    pub timestamp: i64,
}

// Helper function to hash URL for PDA seed
// We use a simple hash or just the bytes if short enough,
// but URLs can be long, so hashing is safer for seeds limit (32 bytes max for a seed is not strict but good practice,
// actually seeds can be up to 32 bytes? No, seeds can be byte arrays.
// Anchor seeds: "The sum of the lengths of all seeds cannot exceed the maximum allowed for a PDA."
// Max seed length is 32 bytes? No.
// Let's use first 32 bytes of SHA256 of the URL to be safe and deterministic.
// anchor_lang doesn't export sha256 directly in a simple way without crypto deps?
// actually `solana_program::hash::hash` is available.
pub fn url_hash(url: &str) -> [u8; 32] {
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(url.as_bytes());
    hasher.finalize().into()
}

#[error_code]
pub enum ErrorCode {
    #[msg("Score must be between 0 and 100.")]
    InvalidScore,
    #[msg("URL is too long.")]
    UrlTooLong,
    #[msg("Provided URL seed does not match actual URL hash.")]
    InvalidUrlHash,
}

#[cfg(test)]
mod tests;
