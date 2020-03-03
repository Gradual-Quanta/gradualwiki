#

symb=branding
qm=$(ipfs add -r -w -Q . ../img/nightysky.jpg)
echo url: http://127.0.0.1:8080/ipfs/$qm
key=$(ipfs key list -l | grep -w $symb | cut -d' ' -f1)
echo url: http://gateway.ipfs.io/ipns/$key
ipfs name publish --key=$symb /ipfs/$qm
echo url: http://ipfs.blockring™.mk/ipfs/$qm

