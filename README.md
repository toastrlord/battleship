# Battleship
This project was created using React. Place your ships and face off against a computer opponent!

# Live Demo
https://toastrlord.github.io/battleship/

# How to Play
## Placing your ships
![Ship selection screen](./readme_images/start.png?raw=true)

To start the game, simply click and drag the ships from the area below onto the blue board. Click the rotate button to turn ships 90 degrees for more placement options.
You (and your opponent) have a total have 5 ships. These ships are:

-Carrier (5 spaces long)

-Battleship (3 spaces long)

-Submarine (3 spaces long)

-Destroyer (3 spaces long)

-PT Boat (2 spaces long)

Cells will be highlighted in white for valid placements...

![A valid ship placment](./readme_images/valid_placement.png?raw=true)

![An invalid ship placement](./readme_images/invalid_placement.png?raw=true)
 
...and in red for invalid placements.

If you do not wish to place all ships manually, click on the "Place Ships Randomly" button. This will place any ships you haven't put on the board already.

Once all ships are placed, the game will start!

## Taking your turn
![A new game](./readme_images/new_game.png?raw=true)

Once the game starts, you will see your board and your opponent's board. Your opponent's board will be hidden at first- you have to guess where they've placed their ships!
Click on a light blue square on the opponent's board to fire. If you miss, the square will turn dark blue, and it will be the opponent's turn.

But, if it turns red....

## Scoring a hit
![A board with a ship that's been hit](./readme_images/hit_ship.png?raw=true)

A red square means you've hit! Search the adjacent squares to find the rest of the ship. Your turn does not end until you've missed a square, so keep at it!

Dark blue squares show where you've already guessed and missed. When red squares turn dark red, congratulations! That means the ship has been sunk

![A ship that's been sunk](./readme_images/sunk_ship.png?raw=true)

## Winning the game
![A victorious game](./readme_images/victory.png?raw=true)

To win, sink all your opponent's ships before they sink yours! 
Be careful: your opponent will not eat, drink or sleep until it has won!

# How the AI works
The AI will do more than just guess random spaces- it will also keep track of ships that it's sunk, and determine if a potential guess could actually fit an enemy ship or not.
It has two modes: search and destroy.

When in search mode, the AI will guess a random space, keeping in mind the minimum possible size of an enemy ship. If a minimum-sized ship could fit in this space, it will fire.
Otherwise, it will search another space and try again. Search mode continues until it scores a hit.

In destroy mode, it will determine which way the ship is facing and search along that direction until the ship is sunk. If it encounters two adjacent ships, it will not revert to search mode until all ships it has found are sunk.

The AI will also update it's information of which enemy ships remain when one is sunk. For instance, if it sinks the enemy's PT boat, it will no longer search in areas that could contain a ship 2 spaces long; instead, it will look for areas that could contain a ship at least 3 spaces long.