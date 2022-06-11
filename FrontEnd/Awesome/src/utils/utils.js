"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMoreMessages = exports.testMessages = exports.generateUniqueKey = exports.getRandomInt = void 0;
// Generate random integer, we will use this to use random message from list of dummy messages.
var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
exports.getRandomInt = getRandomInt;
// Generate unique key for message component of FlatList.
var generateUniqueKey = function () {
    return "_".concat(Math.random().toString(36).substr(2, 9));
};
exports.generateUniqueKey = generateUniqueKey;
// List of test messages to generate chat data.
exports.testMessages = [
    {
        name: 'A',
        age: 1,
        address: 'ABCD'
    },
    {
        name: 'B',
        age: 2,
        address: 'ABCD'
    },
    {
        name: 'C',
        age: 3,
        address: 'ABCD'
    }
];
/**
 * Mocks the api call to query `n` number of messages.
 * We are going to add some timeout before returning the result to simulate an api call over network.
 *
 * We are going to generate two types of message:
 * - sent message
 * - received message
 *
 * This will be controlled by a boolean property on message object - `isMyMessage`.
 * This will be randomly assigned to message, based on result of getRandomInt.
 * These two messages will be styled differently, which is the case for most of the
 * popular messaging applications e.g., whatsapp, messenger
 *
 * @param n {number} Number of new messages to query
 * @param networkLatency {number} Number of milliseconds, to simulate api call.
 */
var queryMoreMessages = function (n, networkLatency, text) {
    if (networkLatency === void 0) { networkLatency = 100; }
    return new Promise(function (resolve) {
        var newMessages = [];
        for (var i = 0; i < n; i++) {
            var messageText = exports.testMessages[(0, exports.getRandomInt)(0, exports.testMessages.length)];
            newMessages.push({
                id: (0, exports.generateUniqueKey)(),
                text: (n == 1 ? text : messageText),
                isMyMessage: (n == 1 ? true : Boolean((0, exports.getRandomInt)(0, 2)))
            });
        }
        // Lets resolve after 500 ms, to simulate network latency.
        setTimeout(function () {
            resolve(newMessages);
        }, networkLatency);
    });
};
exports.queryMoreMessages = queryMoreMessages;