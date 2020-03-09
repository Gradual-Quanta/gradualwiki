#

qm=$(ipfs add -r -Q .)
echo https://cloudflare-ipfs.com/ipfs/$qm
key=$(ipfs key list -l | grep -w qwiki | cut -d' ' -f1)
echo https://ipfs.blockring™.ml/ipns/$key
cat <<EOF > _data/qm.yml
--- # qwiki
key: $key
qm: $qm
EOF
qm=$(ipfs add -r -Q .)
ipfs name publish --key=qwiki $qm
echo https://gateway.ipfs.io/ipfs/$qm

exit $?
true; # $Source: /my/qwiki/publish.sh $
