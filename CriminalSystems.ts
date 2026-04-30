import { world, Player, Item } from '@sky-mp/server';

/**
 * REVISED PROXIMITY CONFIGURATION
 * 150 units = Roughly the reach of a sword (Face-to-Face)
 * 80 units  = Extremely close (Arm's reach/Touching)
 */
const ROB_DISTANCE = 150;
const PICKPOCKET_DISTANCE = 80;
const THEFT_CHANCE = 0.3; // 30% success rate

/**
 * COMMAND: /rob
 */
command("rob", (robber: Player) => {
    // Filter nearby players based on the ROB_DISTANCE (Face-to-Face)
    const nearby = world.getNearbyPlayers(robber, ROB_DISTANCE).filter(p => p !== robber);

    if (nearby.length === 0) {
        robber.sendChatMessage(`No one is close enough to rob. You must be face-to-face (within ${ROB_DISTANCE} units).`);
        return;
    }

    robber.showListMenu("Hold up a traveler:", nearby.map(p => p.getName()), (index) => {
        const victim = nearby[index];
        
        // Final distance check in case they ran away while the menu was open
        if (robber.getDistanceTo(victim) > ROB_DISTANCE + 50) { 
            robber.sendChatMessage("Target moved too far away!");
            return;
        }

        victim.showDialog(
            "HANDS UP!", 
            `${robber.getName()} is threatening you! Do you yield your gold?`, 
            ["Yield and Pay", "Resist (Fight)"], 
            (choice) => {
                if (choice === 0) {
                    processTheft(robber, victim, "robbery");
                } else {
                    world.broadcast(`${victim.getName()} has drawn steel against ${robber.getName()}'s robbery attempt!`);
                }
            }
        );
    });
});

/**
 * COMMAND: /pickpocket
 */
command("pickpocket", (thief: Player) => {
    // Filter nearby players based on PICKPOCKET_DISTANCE (Touching)
    const nearby = world.getNearbyPlayers(thief, PICKPOCKET_DISTANCE).filter(p => p !== thief);

    if (nearby.length === 0) {
        thief.sendChatMessage(`You are too far away to reach their pockets. (Must be within ${PICKPOCKET_DISTANCE} units).`);
        return;
    }

    thief.showListMenu("Choose a target to bleed dry:", nearby.map(p => p.getName()), (index) => {
        const victim = nearby[index];
        
        // Re-check distance to ensure they are still within arm's reach
        if (thief.getDistanceTo(victim) > PICKPOCKET_DISTANCE + 20) {
            thief.sendChatMessage("They moved! You missed your chance.");
            return;
        }

        const roll = Math.floor(Math.random() * 10) + 1;

        if (roll <= 7) {
            // FAILURE (Notify victim)
            thief.sendChatMessage(`You fumbled the theft! ${victim.getName()} noticed you!`);
            victim.sendChatMessage(`You catch ${thief.getName()} trying to cut your coin purse!`);
        } else {
            // SUCCESS (Silent)
            processTheft(thief, victim, "pickpocket");
        }
    });
});

/**
 * CORE LOGIC: processTheft
 * Handles the 1-10% gold transfer and the Discovery Note
 */
function processTheft(actor: Player, victim: Player, type: "robbery" | "pickpocket") {
    const victimGold = victim.getInventoryItemCount("Gold01");
    
    if (victimGold <= 0) {
        actor.sendChatMessage("Their pockets are empty.");
        return;
    }

    const percentage = (Math.floor(Math.random() * 10) + 1) / 100;
    const amount = Math.floor(victimGold * percentage) || 1;

    victim.removeItem("Gold01", amount);
    actor.addItem("Gold01", amount);

    if (type === "robbery") {
        actor.sendChatMessage(`You successfully robbed ${amount} gold.`);
        victim.sendChatMessage(`You gave up ${amount} gold to ${actor.getName()}.`);
    } else {
        actor.sendChatMessage(`You silently lifted ${amount} gold. They didn't feel a thing.`);
        
        // Leave the 'Evidence' Note in the victim's inventory
        // 'TheftNote' is a placeholder for the item ID in the Keizaal modpack
        victim.addItem("TheftNote", 1); 
    }
}