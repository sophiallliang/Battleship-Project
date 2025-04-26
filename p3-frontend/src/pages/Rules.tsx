export default function Rules() {
    return <div>
        <h1>How to Play Battleships</h1>
        <div>This game of guessing, strategy and logical thought dates back to before world war one and is known the world over for being a simple game that can be played with no more than a pencil and two pieces of paper. It is a two player game which has since been released by many board game manufacturers and its popularity can be seen through not only the intricate detail now put into physical and digital renditions of it, but now also in a Hollywood film based on the game.</div>
        <h1>Start/Preparation</h1>
        <div>Each game can vary in the number of ships employed but a common practice is to have 5 ships of differing size (2 to 5) squares. An aircraft carrier is 5 squares long, a battleship is 4 squares long, both a submarine and a destroyer are three squares long and a patrol boat is two squares long. Each player must secretly place their ships on a grid of ten columns by ten rows. These represent the location of the ships on a battlefield. Each player will also be in possession of a second grid of the same size. Where the first grid is their own ships, the second one (which is blank at the beginning of the game) is a mirror of their opponent's battlefield.</div>
        {/* <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <img src="/battleship_game.png" />
        </div> */}
        <h1>In Play</h1>
        <div>
            Once it is determined who will go first, that person will pick a square at random, calling it by its reference of column reference, row number (C3 for example). This represents their firing a missile directly at that square. If the opposing player has any part of one of their ships positioned on this square they must call “hit” and mark on their battlefield (first grid) which part has been hit. Equally the attacking player will place an “X” on their blank grid (the mirror of their opponents field) to show a hit. In this instance the first player will now be allowed to make another guess. This continues until the attacking player misses.
            <br />
            As soon as the attacking player misses, whether it is the first or fifth guess, the tables are turned and the second player may now start making guesses in exactly the same way.
        </div>
        <h1>Victory</h1>
        <div>The player who successfully locates all their opponent’s ships first by hitting each square they occupy is the winner as all ships have been destroyed.</div>
        <h1>Variations</h1>
        <div>
            Because this game has been in existence for so long, there are many different interpretations that apply differing variations on rules, fleet size, game length etc. Popular examples of this can be seen on smart phone applications such as Naval Strike and Naval Combat.
            <br />
            A popular variation known as the Salvo variation looks specifically at the number of shot guesses that can be made per move. In this version a player may take as many guesses as they have ships remaining. So each player starts the game with 5 guesses, each one representing a shot from each of their live ships. As the game goes on and fleet size is reduced through ships being destroyed, so too are the number of guesses per go reduced. Some versions of this approach will not allow an extra guess in the event of a direct hit.
        </div>
    </div>
};