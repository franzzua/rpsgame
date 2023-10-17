### Problems:
* salt is stored in LocalStorage which is unreliable and insecure
  * One can encrypt it with user privateKey, but it's deprecated in MetaMask by security reasons
* 1st player can go offline during 2nd player move. 
* Transactions `play` and `solve` can take long time, another player can send `timeout` transaction with higher fee. 

### Nash equilibrium in RPSLS.
Expected utilities for pure strategies:
1. u1 = -p2+p3+p4-p5
2. u2 = p1-p3+p4-p5
3. u3 = -p1+p2-p4+p5
4. u4 = p1-p2+p3-p5
5. u5 = -p1+p2-p3+p4

If it's an equilibrium so utilities of pure strategies should be equal. So we have linear equations:
```
    │    1     1    1      1    1  │ = │ 1 │ // sum
    │   -1    -1    2     -2	2  │ = │ 0 │ // u1 - u2
p * │    1    -2    1      0	0  │ = │ 0 │ // u1 - u3
    │   -1     0    0     -1	2  │ = │ 0 │ // u1 - u4
    │    1    -2    2     -2	1  │ = │ 0 │ // u1 - u5
```
Inverse this matrix and multiple on results vector we will get solution 
`(0.2, 0.2, 0.2, 0.2, 0.2)`

It's Mixed Strategies Nash Equilibrium of this game.

### If we add `well` to this game, matrix will be
```
    │    1     1    1      1    1    1 │ = │ 1 │ // sum
    │   -1    -1    2     -2	2   -2 │ = │ 0 │ // u1 - u2
p * │    1    -2    1      0	0    0 │ = │ 0 │ // u1 - u3
    │   -1     0    0     -1	2    0 │ = │ 0 │ // u1 - u4
    │    1    -2    2     -2	1    0 │ = │ 0 │ // u1 - u5
    │    0    -1    1     -1	1   -1 │ = │ 0 │ // u1 - u6
```
But solution will be similar `(0.2, 0.2, 0.2, 0.2, 0.2, 0)`


### Task C

Let's consider a step at which there are 2<sup>x</sup> players who have [2<sup>y</sup>+1, 2<sup>y</sup>, 2<sup>y</sup>, …, 2<sup>y</sup>] coins and the first player should give two coins to the 2nd one. <br/>
Next steps will be:<br/>
[2<sup>y</sup>-1, 2<sup>y</sup> +2, 2<sup>y</sup>, 2<sup>y</sup>, …, 2<sup>y</sup>]<br/>
[2<sup>y</sup>-1, 2<sup>y</sup> +1, 2<sup>y</sup>+1, 2<sup>y</sup>, 2<sup>y</sup>, …, 2<sup>y</sup>]<br/>
…<br/>
[2<sup>y</sup>-1, 2<sup>y</sup> +1, 2<sup>y</sup>-1, 2<sup>y</sup>+1, …, 2<sup>y</sup>-1, 2<sup>y</sup>+2] (count of players is even)<br/>
[2<sup>y</sup>, 2<sup>y</sup> +1, 2<sup>y</sup>-1, 2<sup>y</sup>+1, …, 2<sup>y</sup>-1, 2<sup>y</sup>+1]<br/>
After one cycle every odd player lost one coin and every even player received it. So after 2<sup>y</sup> steps odd players will be eliminated and there will be 2<sup>x</sup>-1 players with [2<sup>y</sup>+1+1, 2<sup>y</sup>+1, 2<sup>y</sup>+1,....,2<sup>y</sup>+1] coins and the first player should give 2 coins to the next one. It's the same as the considered situation. Therefore, after x iterations there will be 2<sup>0</sup>=1 player with 2<sup>x+y</sup>+1 coins.

If the game starts with n = 2<sup>m</sup>+1 players then at the first step the first player gives a coin to a 2nd one. After that there are 2<sup>m</sup> players (the 1st have been eliminated) who have [2, 1, 1, …, 1] coins and the first player should give two coins to the next player. It’s a situation described above with x = m and y = 0. So the game will be terminated with a single player with all coins.

Hence there are infinite values of n. 
