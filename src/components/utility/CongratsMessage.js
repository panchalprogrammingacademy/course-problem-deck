const messages = [
    `Woo Hoo! Good for you! Congrats!`,
    `Way to go! Congrats!`,
    `Congratulations! You did it! Still clapping!`,
    `Great work! You totally nailed it!`,
    `Totally superb job! Congrats!`,
    `Well done! You totally rocked!`,
    `Congrats! Above and beyond!`,
    `Congratulations! You've got, all of it!`,
];
export const randomCongratsMessage = () => {
    const index = Math.floor((Math.random() * messages.length));
    return messages[index];
};