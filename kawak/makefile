.PHONY: all
all: build

.PHONY: kawak
.SILENT: kawak
puzzle:
	$(eval kawakCanisterID=$(shell dfx canister id kawak))
	echo kawakCanisterID = $(kawakCanisterID)
	dfx deploy kawak --argument="(principal \"$(kawakCanister)\") " 
	# dfx deploy puzzle --argument="(
	#     principal $(kawakCanisterID)
	# )"
	$(eval kawakCanisterID=$(shell dfx canister id kawak))
	$(eval candidID=$(shell dfx canister id __Candid_UI))
	# Copy declarations into /declarations
	echo kawakCanisterID = $(kawakCanisterID)
	@echo "http://127.0.0.1:8000/?canisterId=$(candidID)&id=$(kawakCanisterID)"


.PHONY: clean-
.SILENT: clean
clean:
	rm -rf ./.dfx/
	rm -rf ./node_modules/
	rm -rf ./src/declarations/
