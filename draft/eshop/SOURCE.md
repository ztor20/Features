# SOURCE — eShop FE provenance & change-tracking

The `FE/` specs and `FE/prototype/` were extracted verbatim from the senior designer's final build.

| | |
|---|---|
| Source repo | `ztor20/Frontend` (`git@github.com-pathfinders:ztor20/Frontend.git`) |
| Branch | **L** |
| Commit | **`3678d1f`** — *docs(changelog): record the 126-commit push delta* |
| Commit date | 2026-06-30 |
| Pulled | 2026-06-30 |
| Scope | `features/shop/` (7 specs) + shop pages / assets / images — **249 tracked files** |

## What was pulled

- `features/shop/*.md` → `FE/` (7 specs, verbatim) + the 2 `SHOP-*-BUILDPROMPT.md`.
- `shop.html · shop-item.html · shop-creators.html · shop-events.html · shop-auction.html · shop-popcorn.html` → `FE/prototype/`
- Shared chrome so it runs: `tokens.css · components.css · section-themes.css`, `assets/*.js`, `assets/*.css`, `css/`, `assets/fonts`, `assets/icons`, `assets/images/{shop,avatars,posters}`.

## Change-tracking — detect updates on branch L

`eshop-source-manifest.tsv` is `git ls-files -s` (mode · blob-sha · stage · path) for the 249 eShop files at commit `3678d1f`. Because git blob SHAs are content hashes, any changed/added/removed file shows up as a diff:

```bash
cd pathfinders/Frontend
GIT_SSH_COMMAND='/c/Windows/System32/OpenSSH/ssh.exe' git fetch origin L
git ls-files -s -- 'features/shop/*' 'shop.html' 'shop-item.html' 'shop-creators.html' \
  'shop-events.html' 'shop-auction.html' 'shop-popcorn.html' 'assets/*shop*' 'assets/cart.*' \
  'assets/checkout.js' 'assets/mock-pay.js' 'assets/refine-shop.css' 'css/components/*shop*' \
  'css/components/47-checkout.css' 'assets/images/shop/*' 'SHOP-1-DETAIL-PAGES-BUILDPROMPT.md' \
  'SHOP-2-CHECKOUT-BUILDPROMPT.md' | sort > /tmp/eshop-new.tsv
diff <(sort ../Features/draft/eshop/eshop-source-manifest.tsv) /tmp/eshop-new.tsv
```

Any output line = a changed eShop file → re-pull that slice and bump the commit above.

> The prototype is a **static extract** — links to non-shop pages 404 by design. It is UI-only (no backend), matching the source.
