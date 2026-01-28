#[cfg(test)]
mod tests {
    use crate::*;
    use anchor_lang::{InstructionData, ToAccountMetas};
    use litesvm::LiteSVM;
    use solana_sdk::{
        instruction::Instruction,
        signature::{Keypair, Signer},
        transaction::Transaction,
    };

    /// Helper function to setup test environment
    fn setup() -> (LiteSVM, Keypair, Keypair) {
        let mut svm = LiteSVM::new();
        let payer = Keypair::new();
        let finder = Keypair::new();

        // Airdrop SOL to payer and finder
        svm.airdrop(&payer.pubkey(), 10_000_000_000).unwrap();
        svm.airdrop(&finder.pubkey(), 10_000_000_000).unwrap();

        // Add program to test environment
        let program_data = include_bytes!("../../../target/deploy/alpha_stamp.so");
        svm.add_program(crate::ID, program_data);

        (svm, payer, finder)
    }

    /// Helper function to derive PDA
    fn get_alpha_stamp_pda(finder: &Pubkey, url_seed: &[u8; 32]) -> (Pubkey, u8) {
        Pubkey::find_program_address(&[b"alpha", finder.as_ref(), url_seed.as_ref()], &crate::ID)
    }

    #[test]
    fn test_stamp_alpha_success() {
        let (mut svm, payer, finder) = setup();

        let url = "https://trends.fun/test";
        let score = 88u8;
        let url_seed = url_hash(url);

        let (alpha_stamp_pda, _bump) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);

        // Create instruction
        let ix = crate::instruction::StampAlpha {
            url: url.to_string(),
            score,
            _url_seed: url_seed,
        };

        let accounts = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction = Instruction {
            program_id: crate::ID,
            accounts: accounts.to_account_metas(None),
            data: ix.data(),
        };

        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        // Execute transaction
        let result = svm.send_transaction(tx);
        assert!(result.is_ok(), "Transaction should succeed");

        // Verify account data
        let account = svm.get_account(&alpha_stamp_pda).unwrap();

        // Deserialize and verify data
        let alpha_stamp: AlphaStamp = AlphaStamp::try_deserialize(&mut &account.data[..]).unwrap();

        assert_eq!(alpha_stamp.finder, finder.pubkey());
        assert_eq!(alpha_stamp.url, url);
        assert_eq!(alpha_stamp.score, score);
        // Note: timestamp may be 0 in test environment
    }

    #[test]
    fn test_pda_derivation() {
        let finder = Keypair::new();
        let url = "https://twitter.com/test";
        let url_seed = url_hash(url);

        let (pda1, bump1) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);
        let (pda2, bump2) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);

        assert_eq!(pda1, pda2, "Same inputs should produce same PDA");
        assert_eq!(bump1, bump2, "Same inputs should produce same bump");
    }

    #[test]
    fn test_invalid_score_too_high() {
        let (mut svm, payer, finder) = setup();

        let url = "https://trends.fun/test";
        let score = 101u8; // Invalid: > 100
        let url_seed = url_hash(url);

        let (alpha_stamp_pda, _bump) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);

        let ix = crate::instruction::StampAlpha {
            url: url.to_string(),
            score,
            _url_seed: url_seed,
        };

        let accounts = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction = Instruction {
            program_id: crate::ID,
            accounts: accounts.to_account_metas(None),
            data: ix.data(),
        };

        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(tx);
        assert!(
            result.is_err(),
            "Transaction should fail with invalid score"
        );
    }

    #[test]
    fn test_score_boundary_values() {
        let (mut svm, payer, finder) = setup();

        // Test score = 0 (valid)
        let url1 = "https://trends.fun/test1";
        let score1 = 0u8;
        let url_seed1 = url_hash(url1);
        let (pda1, _) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed1);

        let ix1 = crate::instruction::StampAlpha {
            url: url1.to_string(),
            score: score1,
            _url_seed: url_seed1,
        };

        let accounts1 = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: pda1,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction1 = Instruction {
            program_id: crate::ID,
            accounts: accounts1.to_account_metas(None),
            data: ix1.data(),
        };

        let tx1 = Transaction::new_signed_with_payer(
            &[instruction1],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        assert!(svm.send_transaction(tx1).is_ok(), "Score 0 should be valid");

        // Test score = 100 (valid)
        let url2 = "https://trends.fun/test2";
        let score2 = 100u8;
        let url_seed2 = url_hash(url2);
        let (pda2, _) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed2);

        let ix2 = crate::instruction::StampAlpha {
            url: url2.to_string(),
            score: score2,
            _url_seed: url_seed2,
        };

        let accounts2 = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: pda2,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction2 = Instruction {
            program_id: crate::ID,
            accounts: accounts2.to_account_metas(None),
            data: ix2.data(),
        };

        let tx2 = Transaction::new_signed_with_payer(
            &[instruction2],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        assert!(
            svm.send_transaction(tx2).is_ok(),
            "Score 100 should be valid"
        );
    }

    #[test]
    fn test_url_too_long() {
        let (mut svm, payer, finder) = setup();

        // Create URL with 101 characters
        let url = "a".repeat(101);
        let score = 50u8;
        let url_seed = url_hash(&url);

        let (alpha_stamp_pda, _bump) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);

        let ix = crate::instruction::StampAlpha {
            url: url.clone(),
            score,
            _url_seed: url_seed,
        };

        let accounts = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction = Instruction {
            program_id: crate::ID,
            accounts: accounts.to_account_metas(None),
            data: ix.data(),
        };

        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(tx);
        assert!(result.is_err(), "Transaction should fail with URL too long");
    }

    #[test]
    fn test_url_max_length() {
        let (mut svm, payer, finder) = setup();

        // Create URL with exactly 100 characters (valid)
        let url = "a".repeat(100);
        let score = 50u8;
        let url_seed = url_hash(&url);

        let (alpha_stamp_pda, _bump) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);

        let ix = crate::instruction::StampAlpha {
            url: url.clone(),
            score,
            _url_seed: url_seed,
        };

        let accounts = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction = Instruction {
            program_id: crate::ID,
            accounts: accounts.to_account_metas(None),
            data: ix.data(),
        };

        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        assert!(
            svm.send_transaction(tx).is_ok(),
            "URL with 100 chars should be valid"
        );
    }

    #[test]
    fn test_invalid_url_hash() {
        let (mut svm, payer, finder) = setup();

        let url = "https://trends.fun/test";
        let score = 50u8;
        let correct_url_seed = url_hash(url);

        // Use wrong hash
        let mut wrong_url_seed = correct_url_seed;
        wrong_url_seed[0] = wrong_url_seed[0].wrapping_add(1);

        let (alpha_stamp_pda, _bump) = get_alpha_stamp_pda(&finder.pubkey(), &wrong_url_seed);

        let ix = crate::instruction::StampAlpha {
            url: url.to_string(),
            score,
            _url_seed: wrong_url_seed,
        };

        let accounts = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction = Instruction {
            program_id: crate::ID,
            accounts: accounts.to_account_metas(None),
            data: ix.data(),
        };

        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(tx);
        assert!(
            result.is_err(),
            "Transaction should fail with invalid URL hash"
        );
    }

    #[test]
    fn test_duplicate_stamp_prevention() {
        let (mut svm, payer, finder) = setup();

        let url = "https://trends.fun/test";
        let score = 75u8;
        let url_seed = url_hash(url);

        let (alpha_stamp_pda, _bump) = get_alpha_stamp_pda(&finder.pubkey(), &url_seed);

        // First stamp - should succeed
        let ix1 = crate::instruction::StampAlpha {
            url: url.to_string(),
            score,
            _url_seed: url_seed,
        };

        let accounts1 = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction1 = Instruction {
            program_id: crate::ID,
            accounts: accounts1.to_account_metas(None),
            data: ix1.data(),
        };

        let tx1 = Transaction::new_signed_with_payer(
            &[instruction1],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        assert!(
            svm.send_transaction(tx1).is_ok(),
            "First stamp should succeed"
        );

        // Second stamp with same URL and finder - should fail
        let ix2 = crate::instruction::StampAlpha {
            url: url.to_string(),
            score,
            _url_seed: url_seed,
        };

        let accounts2 = crate::accounts::StampAlpha {
            finder: finder.pubkey(),
            alpha_stamp: alpha_stamp_pda,
            system_program: solana_sdk::system_program::ID,
        };

        let instruction2 = Instruction {
            program_id: crate::ID,
            accounts: accounts2.to_account_metas(None),
            data: ix2.data(),
        };

        let tx2 = Transaction::new_signed_with_payer(
            &[instruction2],
            Some(&payer.pubkey()),
            &[&payer, &finder],
            svm.latest_blockhash(),
        );

        let result = svm.send_transaction(tx2);
        assert!(
            result.is_err(),
            "Duplicate stamp should fail (account already exists)"
        );
    }
}
