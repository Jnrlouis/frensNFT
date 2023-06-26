;; helloFren
;; <Hello Friends! Wagmi>

(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait.nft-trait)

(define-constant contract-owner tx-sender)
(define-constant AMOUNT u100)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-not-found (err u404))
(define-constant err-unsupported-tx (err u500))
(define-constant err-out-not-found (err u501))
(define-constant err-in-not-found (err u502))
(define-constant err-tx-not-mined (err u503))
(define-constant err-address-mismatch (err u504))
(define-constant err-amount-mismatch (err u505))

(define-non-fungible-token fren uint)

(define-data-var last-token-id uint u0)

;; (define-data-var retrievedPrincipal principal tx-sender)
;; (define-data-var retBuff (buff 256) 0xb5463A49BCe74778db3f498900BEba299f5beEa8)


(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok (some "https://ipfs.io/ipfs/QmVnyq3wkdvksobc6hBA1oibWgb8RpnszSxtYg4YG6rxMM"))
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? fren token-id))
)

(define-constant AUTHORITY 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)


(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (nft-transfer? fren token-id sender recipient)
    )
)

(define-public (mint (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        (asserts! (is-eq tx-sender AUTHORITY) err-owner-only)
        (try! (nft-mint? fren token-id recipient))
        (var-set last-token-id token-id)
        (ok token-id)
    )
)
