function equal(a, b) { return a == b; }
function notEqual(a, b) { return a != b; }
function greaterThan(a, b) { return a > b; }
function key(k, v) { return k; }
function value(k, v) { return v; }
function pair(k, v) { return [k, v]; }

function hashMap(hsh, thunk) {
    var output = [];
    for(var key in hsh)
        output[output.length] = thunk(key, hsh[key]);
    return output;
}

function format() {
    var args = [].slice.call(arguments, 1);
    return arguments[0].replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match;
    });
}

function where(hsh, getter, comparer, val) {
    var output = {};
    if(hsh && getter && comparer){
        for(var key in hsh){
            if(comparer(getter(key, hsh[key]), val))
                output[key] = hsh[key];
        }
    }
    return output;
}

function hashSatisfies(onHand, required) {
    for(var k in required)
        if(!onHand[k] || onHand[k] < required[k])
            return false;
    return true;
}

function formatHash(formatter, hsh) {
    if(hsh){
        var strs = hashMap(hsh, formatter);
        if(strs.length > 0)
            return strs.join("\n");
    }
    return "none";
}

function inc(hsh, itm, amt) {
    amt = amt || 1;
    if(!hsh[itm])
        hsh[itm] = 0;
    hsh[itm] += amt;
}

function dec(hsh, itm, amt) {
    amt = amt || 1;
    if(hsh[itm]){
        hsh[itm] -= amt;
        if(hsh[itm] == 0)
            delete hsh[itm];
    }
}

function transfer(itm, from, to, amt) {
    if(from[itm]){
        dec(from, itm, amt);
        inc(to, itm, amt);
        return true;
    }
    return false;
}

function getPeopleIn(roomId){ 
    return where(everyone, function(k, v){return v.roomId;}, equal, roomId); 
 }

function itemDescription(k, v) { 
    return format("-    {1} {0} - {2}", k, v, 
        (itemCatalogue[k] ? itemCatalogue[k].descrip : "(UNKOWN)")); 
}

function equipDescription(k, v) { 
    return format("*    ({0}) {1} - {2}", k, v, 
        (itemCatalogue[v] ? itemCatalogue[v].descrip : "(UNKOWN)")); 
}

function roomPeopleDescription(k, v) { 
    return format("-    {0}{1}", k, (everyone[k].hp > 0 ? "" : " (KNOCKED OUT)"));
}

function exitDescription(k, v) { 
    return format("+    {0}{1}", k, ((v && roomExists(v.roomId)) ? "" : " (UNDER CONSTRUCTION)")); 
}

function getRoom(id) { return currentRooms[id]; }
function setRoom(id, rm) { currentRooms[id] = rm; }
function roomExists(id) { return getRoom(id) != null; }

function moveItem(itm, from, to, actName, locName) {
	if(transfer(itm, from, to))
        displayln(format("You {0} the {1}.", actName, itm));
    else
        displayln(format("There is no {0} {1}", itm, locName));
}

function informUser(toId, fromId, msg) { 
    if(everyone[toId])
        everyone[toId].msgQ.push([fromId, msg]); 
}

function informUsers(usrs, fromId, msg) {
    for(var userId in usrs)
        informUser(userId, fromId, msg);
}
