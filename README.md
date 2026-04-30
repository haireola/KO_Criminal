# KO_Criminal

"Criminal Activity Expansion" for the Keizaal Online environment.

Keizaal Online: Criminal Activity Expansion
Player-to-Player Robbery & Pickpocketing System
This module introduces immersive, high-stakes criminal interactions between players in the Keizaal Online environment. It provides two distinct gameplay mechanics: Overt Robbery and Covert Pickpocketing, balanced with risk/reward variables and roleplay-focused evidence systems.

## Purpose
To enhance the roleplay (RP) ecosystem by providing a scripted, synchronized method for "highwayman" and "thief" interactions. This system replaces clunky manual gold transfers with a secure, server-validated process that ensures fairness and prevents combat logging during crimes.

## Functionality
1. Overt Robbery (/rob)
   
	Designed for "Stand and Deliver" roleplay scenarios where a player is physically threatened.

	Trigger: Player types /rob in close proximity to another player.

	Distance: Must be face-to-face (within 150 units).

	Mechanism:

	The Robber selects a target from a nearby-player dropdown.

	The Victim receives a UI Popup: "Yield and Pay" or "Resist and Fight."

	If the victim yields, a random 1% to 10% of their gold is transferred to the robber.
	If the victim resists, a global message broadcasts the conflict, initiating PvP.

2. Covert Pickpocketing (/pickpocket)
	Designed for stealth-focused characters to lift gold without immediate detection.

	Trigger: Player types /pickpocket in immediate proximity to a target.

	Distance: Must be in arm's reach (within 80 units).

	Mechanism:

	The server rolls a d10.

	Failure (1-7): The theft fails. The victim is notified: "You feel a hand in your pocket!"

	Success (8-10): Silent transfer of 1% to 10% of the victim's gold.

	The Evidence: On a successful theft, the victim silently receives an item: "Torn Scrap of Paper." When read, it informs them they have lost gold, allowing for delayed RP discovery.

## Technical Implementation
Dependencies

SkyMP Server: Core networking framework.

UI Extensions: Required for the UIMessageBox and UIListMenu client-side interfaces.

Keizaal Online Content & Patches: To host the custom "Evidence Note" item record.

Installation

Server Logic: Place CriminalSystems.ts into your server's src/modules/ directory.

Client Assets: Add KO_CriminalUI.psc to your build pipeline.

ESP Record: In KeizaalContent.esp, create a Book record with the ID TheftNote to serve as the evidence item.

Compilation
Ensure your SkyMP development environment is active, then compile the TypeScript module:

Bash
npm run build
# Or use your specific SkyMP deployment command
## Development Notes
Security: All gold math and item transfers are handled Server-Side. This prevents clients from "spoofing" gold amounts or duplicating currency.

Sync Logic: The system includes a "Drift Check." If a player initiates a command but the target moves beyond the allowed units before the menu selection is finished, the action is cancelled.

Scaling: (Recommended) Developers can easily swap the static roll <= 7 in the pickpocket logic for a check against the player's Pickpocket skill actor value.

## Contribution & Support
If you are a member of the Keizaal Online staff or a developer looking to expand these mechanics (e.g., adding a bounty system or city guard triggers), please refer to the processTheft function in the source for centralized logic.
