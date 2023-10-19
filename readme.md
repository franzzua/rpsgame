## Rock-Paper-Scissors-Lizard-Spock on Etherium

[demo](https://lemon-bay-0e8c9b803.3.azurestaticapps.net)

### How to:
* 1st player 
  * clicks on Create Game on base page
  * selects his choice
  * inputs 2nd player's address
  * select stake in Eth (or in current network token)
  * after he confirms transaction he will be redirected to game-url
  * he sends this url to 2nd player (with some external channel: email, messenger...)
* 2nd player 
  * opens url and selects his choice
  * confirms transaction
* 1st player
  * clicks on `check result` button after 2nd player confirms transaction or after 5 minutes
* 2nd player
  * clicks on `win by timeout` button if 1st player don`t respond in 5 minutes

note: both players can do it in one browser, the app handles account changes


### Problems:
* salt is stored in LocalStorage which is unreliable and insecure
  * One can encrypt it with user privateKey, but it's deprecated in MetaMask by security reasons
* 1st player can go offline during 2nd player move. 
* 1st player can be without money on the last step and not able to pay for a gas 
* Transactions `play` and `solve` can take long time, another player can send `timeout` transaction with higher fee. 
* External communication is needed which may be unreliable or slow (can be replaced as Etherium communication)
* Player discovery not implemented at all - 1st player needs address of 2nd player
* Result of the game is not clear for both players - 2nd player is not able to know 1st player`s choice. 

## Exercise J

### Nash equilibrium in RPSLS.
Expected utilities for pure strategies:
1. u1 = -p2+p3-p4+p5
2. u2 = p1-p3+p4-p5
3. u3 = -p1+p2-p4+p5
4. u4 = p1-p2+p3-p5
5. u5 = -p1+p2-p3+p4

If it's an equilibrium so utilities of pure strategies should be equal. So we have linear equations:
```
    │   1     1    1      1     1  │ = │ 1 │ // sum
    │  -1    -1    2     -2	2  │ = │ 0 │ // u1 - u2
p * │   1    -2    1      0	0  │ = │ 0 │ // u1 - u3
    │  -1     0    0     -1	2  │ = │ 0 │ // u1 - u4
    │   1    -2    2     -2	1  │ = │ 0 │ // u1 - u5
```
Inverse this matrix and multiply on result vector, and here is a solution: 
`(0.2, 0.2, 0.2, 0.2, 0.2)`

It's Mixed Strategies Nash Equilibrium of this game for both players (game is symmetric for both players).

### If we add `well` to this game, matrix become
```
    │   1     1    1      1    1     1 │ = │ 1 │ // sum
    │  -1    -1    2     -2	2   -2 │ = │ 0 │ // u1 - u2
p * │   1    -2    1      0	0    0 │ = │ 0 │ // u1 - u3
    │  -1     0    0     -1	2    0 │ = │ 0 │ // u1 - u4
    │   1    -2    2     -2	1    0 │ = │ 0 │ // u1 - u5
    │   0    -1    1     -1	1   -1 │ = │ 0 │ // u1 - u6
```
But solution is similar `(0.2, 0.2, 0.2, 0.2, 0.2, 0)`


## Exercise I

Let's consider a step at which there are 2<sup>x</sup> players who have [2<sup>y</sup>+1, 2<sup>y</sup>, 2<sup>y</sup>, …, 2<sup>y</sup>] coins and the first player should give two coins to the 2nd one. <br/>
Next steps will be:<br/>
[2<sup>y</sup>-1, 2<sup>y</sup> +2, 2<sup>y</sup>, 2<sup>y</sup>, …, 2<sup>y</sup>]<br/>
[2<sup>y</sup>-1, 2<sup>y</sup> +1, 2<sup>y</sup>+1, 2<sup>y</sup>, 2<sup>y</sup>, …, 2<sup>y</sup>]<br/>
…<br/>
[2<sup>y</sup>-1, 2<sup>y</sup> +1, 2<sup>y</sup>-1, 2<sup>y</sup>+1, …, 2<sup>y</sup>-1, 2<sup>y</sup>+2] (count of players is even)<br/>
[2<sup>y</sup>, 2<sup>y</sup> +1, 2<sup>y</sup>-1, 2<sup>y</sup>+1, …, 2<sup>y</sup>-1, 2<sup>y</sup>+1]<br/>
After one cycle every odd player lost one coin and every even player received it. So after 2<sup>y</sup> steps odd players will be eliminated and there will be 2<sup>x</sup>-1 players with [2<sup>y+1</sup>+1, 2<sup>y+1</sup>, 2<sup>y+1</sup>,....,2<sup>y+1</sup>] coins and the first player should give 2 coins to the next one. It's the same as the considered situation. Therefore, after x iterations there will be 2<sup>0</sup>=1 player with 2<sup>x+y</sup>+1 coins.

If the game starts with n = 2<sup>m</sup>+1 players then at the first step the first player gives a coin to a 2nd one. After that there are 2<sup>m</sup> players (the 1st have been eliminated) who have [2, 1, 1, …, 1] coins and the first player should give two coins to the next player. It’s a situation described above with x = m and y = 0. So the game will be terminated with a single player with all coins.

Hence there are infinite values of n. 
