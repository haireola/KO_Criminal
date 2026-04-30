Scriptname KO_CriminalUI extends Quest

; Dependencies: UIExtensions by sushisquid

Function ShowVictimPrompt(String RobberName, Int EstimatedGold)
    UIMessageBox menu = UIExtensions.GetMenu("UIMessageBox") as UIMessageBox
    
    menu.SetPropertyString("title", "ROBBERY")
    menu.SetPropertyString("message", RobberName + " demands your coin! They expect roughly " + EstimatedGold + " gold.")
    
    menu.AddButton("Give Gold", 0)
    menu.AddButton("Fight Back!", 1)
    
    menu.OpenMenu()
    Int result = menu.GetResultInt()
    
    ; Send result back to SkyMP server
    SendChoiceToServer(result)
EndFunction

Function GiveTheftNote(Int AmountLost)
    ; This adds a custom note to the player's inventory that the victim finds later
    ; Requires a pre-defined Note base object
    Book Property TheftNoteBase Auto
    
    String NoteText = "Your coin purse feels significantly lighter. You estimate " + AmountLost + " gold is missing."
    ; Script logic to update the Note's text would go here
    Game.GetPlayer().AddItem(TheftNoteBase, 1, true)
EndFunction