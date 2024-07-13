read -p "Enter commit message: " MESG

exceptions=("exit" "quit" ":q" ":qa" "q")

for i in "${exceptions[@]}"; do
    if [ "$MESG" == "$i" ]; then
        echo "Exiting...";
        exit 0;
    fi
done

git add .;
git commit -m $MESG;
git push origin main;
exit 0;