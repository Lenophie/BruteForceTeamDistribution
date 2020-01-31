const fs = require('fs');

const numberOfParticipants = 35;
const numberOfParticipantsPerTable = 5;
const numberOfRounds = 3;
const numberOfTables = 7;

let participants = [];
let rounds = [];

const startSimulation = () => {
    Initialize();
    for (let round = 0; round < numberOfRounds; round++) simulateRound(round);
};

const Initialize = () => {
    participants = [];
    for (let i = 1; i <= numberOfParticipants; i++) {
        const participant = {id: i, tables: [], friends: []};
        participants.push(participant);
    }

    rounds = [];
    for (let i = 1; i <= numberOfRounds; i++) {
        let roundTables = [];
        for (let j = 1; j <= numberOfTables; j++)
            roundTables.push([]);
        rounds.push(roundTables);
    }
};

const simulateRound = (roundIndex) => {
    const round = rounds[roundIndex];

    const participantIndexes = [];
    for (let i = 0; i < numberOfParticipants; i++) {
        participantIndexes.push(i);
    }
    const shuffledParticipantIndexes = shuffle(participantIndexes);

    for (let participantIndex = 0; participantIndex < numberOfParticipants; participantIndex++) {
        const participant = participants[shuffledParticipantIndexes[participantIndex]];
        if (!isParticipantAlreadySitThisRound(participant, round)) {
            for (let tableIndex = 0; tableIndex < numberOfTables; tableIndex++) {
                const table = round[tableIndex];
                if (!isTableFull(table) && !doesParticipantHaveAlreadyMetPeopleFromTable(table, participant)) {
                    participant.tables.push(tableIndex);
                    table.push(participant.id);
                    break;
                }
            }
        }
    }
};

const isParticipantAlreadySitThisRound = (participant, roundNumber) => {
    return participant.tables.length === roundNumber;
};

const isTableFull = (table) => {
    return table.length === numberOfParticipantsPerTable;
};

const doesParticipantHaveAlreadyMetPeopleFromTable = (table, participant) => {
    for (let tableParticipantIndex = 0; tableParticipantIndex < table.length; tableParticipantIndex++) {
        const tableParticipant = table[tableParticipantIndex];
        for (let previousTableIndex = 0; previousTableIndex < participant.tables.length; previousTableIndex++) {
            const previousTableNumber = participant.tables[previousTableIndex];
            const previousTable = rounds[previousTableIndex][previousTableNumber];
            for (let previousTableParticipantIndex = 0; previousTableParticipantIndex < previousTable.length; previousTableParticipantIndex++) {
                if (previousTable[previousTableParticipantIndex] === tableParticipant) return true;
            }
        }
    }
    return false;
};

const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

const doAllParticipantsHaveThreeTables = () => {
    for (let participantIndex = 0; participantIndex < numberOfParticipants; participantIndex++) {
        if (participants[participantIndex].tables.length < 3) return false;
    }
    return true;
};

const determineFriends = () => {
    for (let participantIndex = 0; participantIndex < participants.length; participantIndex++) {
        const participant = participants[participantIndex];
        for (let roundIndex = 0; roundIndex < participant.tables.length; roundIndex++) {
            const tableNumber = participant.tables[roundIndex];
            for (let potentialFriendIndex = 0; potentialFriendIndex < participants.length; potentialFriendIndex++) {
                if (potentialFriendIndex !== participantIndex) {
                    const potentialFriend = participants[potentialFriendIndex];
                    if (potentialFriend.tables[roundIndex] === tableNumber) participant.friends.push(potentialFriend.id);
                }
            }
        }
    }
};

const checkForDuplicateFriends = () => {
    for (let participantIndex = 0; participantIndex < participants.length; participantIndex++) {
        const friends = participants[participantIndex].friends;
        for (let i = 0; i < friends.length; i++) {
            for (let j = 0; j < friends.length; j++) {
                if (i !== j && friends[i] === friends[j]) return true;
            }
        }
    }
    return false;
};

while (participants.length === 0 || !doAllParticipantsHaveThreeTables()) {
    startSimulation();
}
determineFriends();
console.log(participants);
console.log(checkForDuplicateFriends());

fs.writeFile("output.json", JSON.stringify(participants, null, 4), 'utf8', function (err) {
    if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});