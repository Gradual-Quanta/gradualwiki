#

qm=$(ipfs add -r -Q .)
echo https://cloudflare-ipfs.com/ipfs/$qm
key=$(ipfs key list -l | grep -w gradualwiki | cut -d' ' -f1)
echo https://ipfs.blockring™.ml/ipns/$key
cat <<EOF > _data/qm.yml
--- # *wiki
key: $key
qm: $qm
EOF
qm=$(ipfs add -r -Q .)
ipfs name publish --key=gradualwiki $qm
echo https://gateway.ipfs.io/ipfs/$qm

exit $?
true; # $Source: /my/wiki/publish.sh $
