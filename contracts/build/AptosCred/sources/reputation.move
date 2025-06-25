module aptoscred::reputation {
    use aptos_std::bcs;
    use std::signer;
    use std::vector;
    use std::table;

    /// Struct to track reputation and endorsements
    struct Reputation has key, store, drop {
        points: u64,
        endorsements: vector<vector<u8>>, // list of endorsers (as account addresses in bytes)
    }

    /// Mapping from user address to their Reputation
    struct ReputationStore has key {
        users: table::Table<address, Reputation>,
    }

    /// Initializes the ReputationStore resource under the caller's account
    public entry fun init_store(account: &signer) {
        move_to(account, ReputationStore {
            users: table::new<address, Reputation>(),
        });
    }

    /// Adds an endorsement to a user by the endorser (caller)
    public entry fun endorse(user: address, endorser: &signer) acquires ReputationStore {
        let store = borrow_global_mut<ReputationStore>(signer::address_of(endorser));
        let reputation = table::borrow_mut_with_default(&mut store.users, user, Reputation {
            points: 0,
            endorsements: vector::empty()
        });

        let endorser_bytes = bcs::to_bytes(&signer::address_of(endorser));
        vector::push_back(&mut reputation.endorsements, endorser_bytes);
        reputation.points = reputation.points + 10;
    }

    /// Returns the reputation score of a user from the specified store owner
    public fun get_reputation(user: address, store_owner: address): u64 acquires ReputationStore {
        let store = borrow_global<ReputationStore>(store_owner);
        let reputation = table::borrow(&store.users, user);
        reputation.points
    }
}
