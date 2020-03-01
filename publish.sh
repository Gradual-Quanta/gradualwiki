#

qm=$(ipfs add -r -Q .)
echo https://cloudflare-ipfs.com/ipfs/$qm
key=$(ipfs key list -l | grep -w gradualwiki | cut -d' ' -f1)
echo https://ipfs.blockring™.ml/ipns/$key
ipfs name publish --key=gradualwiki $qm
echo https://gateway.ipfs.io/ipfs/$qm
