var twitch_streamerbot_ws = null;
var SHIPS_TO_PLAYER = [null, null, null, null, null];
var PLAYERS_CRIT_BUFF = [0, 0, 0, 0, 0];
function connectws() {
    if ("WebSocket" in window) {
        var rd_streamerbot_ws = new WebSocket("wss://spirodon.games/gamesocket/websocket");
        rd_streamerbot_ws.onopen = function() {
            rd_streamerbot_ws.send(JSON.stringify(
                {
                    "set_filters": {
                    "commands": [
                      "up", "down", "left", "right", "attack", "spawn", "despawn", "kraken"
                    ],
                    "matches": [
                      "^[lurda]+$"
                    ]
                  }
                }
            ));
        };
        rd_streamerbot_ws.onmessage = function (event) {
            if (event.data) {
                var data = JSON.parse(event.data);
                console.log('RYANDATA', data);
                if (data.commands) {
                    for (var i = 0; i < data.commands.length; ++i) {
                        console.log('COMMAND', data.commands[i]);
                        var user = data.commands[i].user;
                        var cmd = data.commands[i].cmd;
                        if (cmd === 'attack') {
                            if (_GAME) {
                                var player_index = SHIPS_TO_PLAYER.indexOf(user);
                                var have_crit = PLAYERS_CRIT_BUFF[player_index];
                                if (have_crit) {
                                    // Javascript match random chance to set to true or false
                                    PLAYERS_CRIT_BUFF[player_index] = Math.random() < 0.5;
                                }
                                if (player_index !== -1) {
                                    // Only attack the other two players from SHIPS_TO_PLAYER
                                    for (var i = 0; i < SHIPS_TO_PLAYER.length; i++) {
                                        if (i !== player_index && _GAME.game_entityGetHealth(i) > 0) {
                                            _GAME.game_entityAttack(player_index, i, have_crit);
                                        }
                                        _GAME.game_entityAttack(player_index, 9-1, have_crit);
                                    }
                                }
                            }
                            continue;
                        }
                        cmd = cmd.split('');
                        // console.log(cmd);
                        if (cmd.length > 1 && user.length > 0) {
                            // We assume this means a multi-command
                            for (var j = 0; j < cmd.length; ++j) {
                                if (cmd[j] === 'u') {
                                    if (_GAME) {
                                        var player_index = SHIPS_TO_PLAYER.indexOf(user);
                                        if (player_index !== -1) {
                                            _GAME.inputs_inputUp(player_index);
                                        }
                                    }
                                } else if (cmd[j] === 'd') {
                                    if (_GAME) {
                                        var player_index = SHIPS_TO_PLAYER.indexOf(user);
                                        if (player_index !== -1) {
                                            _GAME.inputs_inputDown(player_index);
                                        }
                                    }
                                } else if (cmd[j] === 'l') {
                                    if (_GAME) {
                                        var player_index = SHIPS_TO_PLAYER.indexOf(user);
                                        if (player_index !== -1) {
                                            _GAME.inputs_inputLeft(player_index);
                                        }
                                    }
                                } else if (cmd[j] === 'r') {
                                    if (_GAME) {
                                        var player_index = SHIPS_TO_PLAYER.indexOf(user);
                                        if (player_index !== -1) {
                                            _GAME.inputs_inputRight(player_index);
                                        }
                                    }
                                } else if (cmd[j] === 'a') {
                                    if (_GAME) {
                                        var player_index = SHIPS_TO_PLAYER.indexOf(user);
                                        var have_crit = PLAYERS_CRIT_BUFF[player_index];
                                        if (have_crit) {
                                            // Javascript match random chance to set to true or false
                                            PLAYERS_CRIT_BUFF[player_index] = Math.random() < 0.5;
                                        }
                                        if (player_index !== -1) {
                                            // Only attack the other two players from SHIPS_TO_PLAYER
                                            for (var i = 0; i < SHIPS_TO_PLAYER.length; i++) {
                                                if (i !== player_index && _GAME.game_entityGetHealth(i) > 0) {
                                                    _GAME.game_entityAttack(player_index, i, have_crit);
                                                }
                                                _GAME.game_entityAttack(player_index, 9-1, have_crit);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const twitch_streamerbot_ws = new WebSocket("ws://127.0.0.1:8080/");
        twitch_streamerbot_ws.onopen = function() {
            twitch_streamerbot_ws.send(JSON.stringify(
                {
                    "request": "Subscribe",
                    "events": {
                        "Twitch": [
                            "ChatMessage",
                            "Cheer",
                            "Sub",
                            "ReSub",
                            "GiftSub",
                            "GiftBomb",
                            "Follow",
                            "Raid",
                            "RewardRedemption",
                        ]
                    },
                    "id": "123"
                }
            ));
        };
        // TODO: Rate throttle the messages
        var alert_element = null;
        twitch_streamerbot_ws.onmessage = function (event) {
            // grab message and parse JSON
            const msg = event.data;
            const wsdata = JSON.parse(msg);
            console.log(wsdata);

            if (!alert_element) {
                var alert_element = document.createElement('div');
                alert_element.style.position = 'absolute';
                alert_element.style.top = '0';
                alert_element.style.left = '0';
                alert_element.style.width = '100%';
                alert_element.style.height = '100%';
                alert_element.style.backgroundColor = 'rgba(0,0,0,0.5)';
                alert_element.style.color = 'white';
                alert_element.style.zIndex = '3000';
                alert_element.style.display = 'none';
                alert_element.style.justifyContent = 'center';
                alert_element.style.alignItems = 'center';
                alert_element.style.fontSize = '2rem';
                document.body.appendChild(alert_element);
            }

            // TODO: Chain commands like !uudrrd
            // TODO: Redeem twitch channel points to be a boss ship
            // TODO: !move u2r2d!
            // TODO: Per user ships
            // check for events to trigger
            // TODO: Raiders spawn a new ship, health points are equal to # of raiders, go kill raider ship
            // Good idea from Elco - keep current count of viewers in cache, after raid, compare new count, diff = # of raiders
            // TODO: !spawn command for chat users who WANT to participate
            // TODO: Queue system for spawn/respawn in case of massive user count
            // TODO: Add sea mines
            // TODO: damage = Math.floor(Math.random() * 10);
            // TODO: ARENA - level up with viewer minutes, visit merchants by spending channel points to upgrade your player, then challenge players at top of leaderboard
            // TODO: During emote only, use channel points to send commands
            // TODO: Game mode where kraken chases you and you have to survive and put blockers in the way
            // TODO: Move to XY and autopath to it
            // TODO: !direction that persists across frames with a !stop
            // TODO: !poops command drops yoshi eggs in water
            // TODO: sounds, like screaming
            // TODO: red sea when you sink
            // TODO: redeem channel points / rewards for being the kraken
            if (wsdata.event.source === 'Twitch') {
                if (wsdata.data.message && wsdata.data.message.displayName) {
                    wsdata.data.message.displayName = wsdata.data.message.displayName.toLowerCase();
                }
                if (wsdata.event.type === 'RewardRedemption') {
                    if (wsdata.data.reward.title === 'Kraken') {
                        if (OCTOPUS[3] === false) {
                            ENABLE_KRAKEN();
                        }
                    }
                } else if (wsdata.event.type === 'Raid') {
                    // alert(`trigger raid event for ${wsdata.data.displayName} ${wsdata.data.viewers}`);
                    alert_element.innerHTML = `THANK YOU FOR THE RAID! ${wsdata.data.displayName} ${wsdata.data.viewers}`;
                    setTimeout(function() {
                        alert_element.style.display = 'none';
                    }, 1000);
                    ENABLE_KRAKEN();
                    _GAME.game_entitySetHealth((9-1), wsdata.data.viewers);
                } else if (wsdata.event.type === 'Sub' || wsdata.event.type === 'ReSub') {
                    // alert(`trigger sub event for ${wsdata.data.displayName}`);
                    alert_element.innerHTML = `THANK YOU FOR THE SUB! ${wsdata.data.displayName}`;
                    setTimeout(function() {
                        alert_element.style.display = 'none';
                    }, 1000);
                } else if (wsdata.event.type === 'GiftSub') {
                    // alert(`trigger Gift sub event for ${wsdata.data.recipientDisplayName}`);
                    alert_element.innerHTML = `THANK YOU FOR THE GIFT SUB! ${wsdata.data.recipientDisplayName}`;
                    setTimeout(function() {
                        alert_element.style.display = 'none';
                    }, 1000);
                } else if (wsdata.event.type === 'GiftBomb') {
                    if (wsdata.data.isAnonymous === false) {
                        // alert(`trigger gift bomb event for ${wsdata.data.displayName} ${wsdata.data.gifts} subs`);
                        alert_element.innerHTML = `THANK YOU FOR THE GIFT BOMB! ${wsdata.data.displayName} ${wsdata.data.gifts} subs`;
                        setTimeout(function() {
                            alert_element.style.display = 'none';
                        }, 1000);
                    } else {
                        // alert(`trigger gift bomb event for Anonymous ${wsdata.data.gifts} subs`);
                        alert_element.innerHTML = `THANK YOU FOR THE GIFT BOMB! Anonymous ${wsdata.data.gifts} subs`;
                        setTimeout(function() {
                            alert_element.style.display = 'none';
                        }, 1000);
                    }
                } else if (wsdata.event.type === 'Follow') {
                    // alert(`trigger follow event for ${wsdata.data.displayName}`);
                    alert_element.innerHTML = `THANK YOU FOR THE FOLLOW! ${wsdata.data.displayName}`;
                    setTimeout(function() {
                        alert_element.style.display = 'none';
                    }, 1000);
                } else if (wsdata.event.type === 'Cheer') {
                    // alert(`trigger cheer event for ${wsdata.data.message.displayName} ${wsdata.data.message.bits}`);
                    var bits = wsdata.data.message.bits;
                    if (bits >= 5) {
                        var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                        if (player_index !== -1) {
                            PLAYERS_CRIT_BUFF[player_index] = true;
                        }
                    }
                    alert_element.innerHTML = `THANK YOU FOR THE CHEER! ${wsdata.data.message.displayName} ${wsdata.data.message.bits}`;
                    setTimeout(function() {
                        alert_element.style.display = 'none';
                    }, 1000);
                } else if (wsdata.event.type === 'ChatMessage') {
                    // alert(`trigger chat message event for ${wsdata.data.message.displayName} ${wsdata.data.message.message}`);
                    // alert_element.innerHTML = `${wsdata.data.message.displayName} says: ${wsdata.data.message.message}`;
                    // alert_element.style.display = 'flex';
                    if (wsdata.data.message.message === '!up' || wsdata.data.message.message === '!u') {
                        if (_GAME) {
                            // Get the current player matching against PLAYER_TO_SHIP, get index of PLAYER_TO_SHIP, then call inputs_inputUp with that index
                            var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                            if (player_index !== -1) {
                                _GAME.inputs_inputUp(player_index);
                            }
                            // _GAME.inputs_inputUp(0);
                        }
                    } else if (wsdata.data.message.message === '!down' || wsdata.data.message.message === '!d') {
                        if (_GAME) {
                            var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                            if (player_index !== -1) {
                                _GAME.inputs_inputDown(player_index);
                            }
                            // _GAME.inputs_inputDown(0);
                        }
                    } else if (wsdata.data.message.message === '!left' || wsdata.data.message.message === '!l') {
                        if (_GAME) {
                            var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                            if (player_index !== -1) {
                                _GAME.inputs_inputLeft(player_index);
                            }
                            // _GAME.inputs_inputLeft(0);
                        }
                    } else if (wsdata.data.message.message === '!right' || wsdata.data.message.message === '!r') {
                        if (_GAME) {
                            var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                            if (player_index !== -1) {
                                _GAME.inputs_inputRight(player_index);
                            }
                            // _GAME.inputs_inputRight(0);
                        }
                    } else if (wsdata.data.message.message === '!attack' || wsdata.data.message.message === '!a') {
                        if (_GAME && 1 == 2) {
                            var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                            var have_crit = PLAYERS_CRIT_BUFF[player_index];
                            if (have_crit) {
                                // Javascript match random chance to set to true or false
                                PLAYERS_CRIT_BUFF[player_index] = Math.random() < 0.5;
                            }
                            if (player_index !== -1) {
                                // Only attack the other two players from SHIPS_TO_PLAYER
                                for (var i = 0; i < SHIPS_TO_PLAYER.length; i++) {
                                    if (i !== player_index && _GAME.game_entityGetHealth(i) > 0) {
                                        _GAME.game_entityAttack(player_index, i, have_crit);
                                    }
                                    _GAME.game_entityAttack(player_index, 9-1, have_crit);
                                }
                            }
                            // _GAME.game_entityAttack(0, 1);
                            // _GAME.game_entityAttack(0, 2);
                        }
                    } else if (wsdata.data.message.message === '!spawn') {
                        // First make sure the player isn't already in the game
                        var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                        if (player_index < 0) {
                            for (var i = 0; i < SHIPS_TO_PLAYER.length; i++) {
                                if (SHIPS_TO_PLAYER[i] === null) {
                                    SHIPS_TO_PLAYER[i] = wsdata.data.message.displayName;
                                    EDITOR.updateEntityName(i + 1, wsdata.data.message.displayName);
                                    EDITOR.updateShipEditorName(i + 1, wsdata.data.message.displayName);
                                    _GAME.game_entitySetHealth(i, 8);
                                    _GAME.diff_addData(0);
                                    break;
                                }
                            }
                        }
                    } else if (wsdata.data.message.message.startsWith('!done')) {
                        var player_index = SHIPS_TO_PLAYER.indexOf(wsdata.data.message.displayName);
                        if (player_index !== -1) {
                            SHIPS_TO_PLAYER[player_index] = null;
                            EDITOR.updateEntityName(player_index + 1, '[EMPTY]');
                            EDITOR.updateShipEditorName(player_index + 1, '[EMPTY]');
                            _GAME.diff_addData(0);
                        }
                    } else if (wsdata.data.message.message.startsWith('!despawn')) {
                        if (wsdata.data.message.role >= 2) {
                            var split = wsdata.data.message.message.split(' ');
                            if (split.length === 2) {
                                var ship_number = parseInt(split[1]);
                                if (ship_number >= 1) {
                                    ship_number -= 1;
                                    if (ship_number >= 0 && ship_number < SHIPS_TO_PLAYER.length) {
                                        SHIPS_TO_PLAYER[ship_number] = null;
                                        EDITOR.updateEntityName(ship_number + 1, '[EMPTY]');
                                        EDITOR.updateShipEditorName(ship_number + 1, '[EMPTY]');
                                        _GAME.diff_addData(0);
                                    }
                                }
                            }
                        }
                    } else if (wsdata.data.message.message === '!reset') {
                        if (wsdata.data.message.role >= 2) {
                            window.location.reload();
                        }
                    } else if (wsdata.data.message.message === '!kraken') {
                        if (wsdata.data.message.role >= 2) {
                            ENABLE_KRAKEN();
                        }
                    }

                    for (var i = 0; i < SHIPS_TO_PLAYER.length; i++) {
                        if (_GAME.game_entityGetHealth(i) <= 0) {
                            SHIPS_TO_PLAYER[i] = null;
                            document.querySelector('[data-entity-id="' + (i + 1) + '"]').classList.add('juicy__shake__2');
                            EDITOR.updateEntityName(i + 1, '[EMPTY]');
                            EDITOR.updateShipEditorName(i + 1, '[EMPTY]');
                            _GAME.diff_addData(0);
                        }
                    }
                    if (_GAME.game_entityGetHealth((9-1)) <= 0) {
                        DISABLE_KRAKEN();
                    }
                }
            }
        };
    }
}

window.addEventListener('load', function() {
    var hash = location.hash.substr(1);
    if (hash && hash === 'twitch') {
        connectws();
    }
});
