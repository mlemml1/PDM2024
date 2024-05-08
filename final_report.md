---
layout: post
title: "Final Report"
permalink: /final-report
---

# ArduinoTRIS

**ArduinoTRIS** is a game similar to the popular game **TETRIS**, in which your goal is to stack up differently shaped blocks optimally into a fixed grid.

This game was created as my final project in LSU's Programming Digital Media course (CSC 2463).

![screenshot](/report_assets/screenshot.png)

## Gameplay
The game consists of several rows ands and columns, and when the bottom-most row is filled, all blocks are shifted down. If the blocks reach the top of the grid, the game ends. The game increases in difficulty by speeding up as lines are cleared. The more lines a player clears at once, the more points they achieve.

On the right, the four upcoming pieces are displayed. Experienced players can use this to make better decisions about how and where to place their next piece.

As in normal **TETRIS**, the player also has the option of "holding" their current piece, which swaps their current piece with the next in line.
![screenshot](/report_assets/hold.png)

## How does it work?

**ArduinoTRIS** is controlled entirely via an Arduino microcontroller, and all gameplay and rendering is handled via P5.js. Interaction with the Arduino is handled by the P5 webserial library, through serial communication.
![screenshot](/report_assets/breadboard.png)

In the center of the breadboard, a seven-segment display is featured.
During gameplay, this lights up to display the player's current score in the game.


#### Controls:
- Movement of the pieces is controlled via the attached joystick.
- Moving the joystick left and right moves the piece on-screen left and right, accordingly.
- Moving the joystick up causes the piece to rotate to the right. (Left rotation is supported in code, but unfortunately I ran out of physical inputs 😊)
- Clicking the joystick causes the current piece to immediately "hard drop" to the bottom of the screen.
- The button seen on the left of the breadboard is used to "hold" the current piece.

For debugging, the game also supports keyboard input. The arrow keys emulate the joystick, 'C' is used to hold, and space to hard drop.


The most challenging aspect of the project was getting the seven-segment to correctly interact with the Arduino microcontroller.
The seven-segment display can only display a single digit at once (it has only 12 input pins), so a shift register chip (included with the ELEGOO starter kit) was required to cycle through the various digits to create the appearance of a consistent number.

The following YouTube video tutorial was extremely helpful in setting up the 7-segment display circuitry.
[![gameplay video](https://img.youtube.com/vi/gesrM2J8VnY/0.jpg)](https://www.youtube.com/watch?v=gesrM2J8VnY)

Shown below is the circuit diagram from the video for the seven segment integration, which I used heavily in my project.
![circuit diagram](/report_assets/circuit_diagram.png)

## Graphics

The **ArduinoTRIS** grid is drawn entirely through P5.

I created a simple block sprite in Paint.NET in order to make the pieces look more visually interesting:

![circuit diagram](/final/assets/block.png)

The sprite is tinted within P5 based on the active block, to give it a contrasting color based on the piece it belongs to.

After the sprite was created, I built several utility functions in my code to abstract the drawing of pieces. This functionality is used to draw the main grid, as well as the "upcoming piece" list and the "hold" window.

The main game loop and all piece/sound logic is handled in Javascript.
The piece movement logic is fully compliant with [**TETRIS** standards](https://tetris.fandom.com/wiki/SRS), and should match other **TETRIS** implementations.

## Music

Creating effective music that feels reactive to your gameplay was a particular challenge.

To start, I laid out the classic **TETRIS** theme as a series of notes to be played in a Tone.JS sequence.

![background music](/report_assets/bgseq.png)

As the main background music sequence plays, a second 'silent' sequence runs in the background ('basePart' in the code above).

This second 'silent' sequence controls a global variable, 'baseNote'. As the background music plays, 'baseNote' is changed to a note that harmonizes with the **TETRIS** melody.

Whenever a piece is moved, rotated, or dropped, this 'baseNote' is used to play a synth sound effect that matches up with the background!

A final sound effect was created for when a line is cleared. This uses chained Tone.JS effects; a Tone.FrequencyEnvelope is used to control the frequency of a Tone 'triangle' oscillator, which is subsequently passed through a low-pass filter.
This creates an arcade-style 'sweep' sound effect to let you know a line has been cleared and your score has increased!

All sound effects and music are piped through a final Tone reverb effect to make the game sound a little more interesting.

## Future Plans

In the future, I'd love to give the game more visual flair (level up screen effects, glows when a piece is dropped or a line is cleared, and maybe some background art).

I'd also love to extend the physical computing aspect of the project, potentially with multiple microcontrollers. Displaying some information on upcoming pieces via the liquid crystal display included in the ELEGOO starter kit would be particularly interesting.

On the P5 side of things, I'd like to extend the game to give it a leaderboard functionality, so players can compare their scores and compete to obtain the highest spot on the leaderboard.

## Gameplay Video
[![gameplay video](https://img.youtube.com/vi/k-vO6biQfcY/0.jpg)](https://www.youtube.com/watch?v=k-vO6biQfcY)