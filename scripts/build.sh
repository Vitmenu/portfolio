MESG=$1

if [ -z "$MESG" ]; then
    echo "Error: Missing required arguments.";
    exit 1;
else
    git add .;
    git commit -m $MESG;
    git push origin main;
    exit 0;
fi