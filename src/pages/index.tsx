import { Fragment, useEffect, useState } from "react";

interface HomeProps {}

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const toggleColor = (colNum: number, rowNum: number) => {
    if (colNum % 2 === 0) {
      return rowNum % 2 === 0;
    } else {
      return rowNum % 2 !== 0;
    }
  };

  const [showBox, setShowBox] = useState<boolean>(false);
  const [stop, setStop] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);

  const [right, setRight] = useState<number | undefined>();
  const [left, setLeft] = useState<number | undefined>();
  const [nextRow, setNextRow] = useState<number | undefined>();
  const [killLeft, setKillLeft] = useState<number | undefined>();
  const [killRight, setKillRight] = useState<number | undefined>();

  const [rightBottom, setRightBottom] = useState<number | undefined>();
  const [leftBottom, setLeftBottom] = useState<number | undefined>();
  const [bottomRow, setBottomRow] = useState<number | undefined>();
  const [killBottomLeft, setKillBottomLeft] = useState<number | undefined>();
  const [killBottomRight, setKillBottomRight] = useState<number | undefined>();

  const setUndefinedTop = () => {
    setLeft(undefined);
    setRight(undefined);
    setNextRow(undefined);
    setKillRight(undefined);
    setKillLeft(undefined);
  };
  const setUndefinedBottom = () => {
    setLeftBottom(undefined);
    setRightBottom(undefined);
    setBottomRow(undefined);
    setKillBottomRight(undefined);
    setKillBottomLeft(undefined);
  };

  const [matrix, setMatrix] = useState([
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
  ]);

  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      if (matrix[0][i] === 1) {
        let tempMatrix = [...matrix];
        tempMatrix[0][i] = 3;
      }
      if (matrix[7][i] === 2) {
        let tempMatrix = [...matrix];
        tempMatrix[7][i] = 4;
      }
    }
  }, [matrix]);

  const onSoldierClick = (rowNum: number, colNum: number) => {
    setUndefinedTop();
    setUndefinedBottom();
    setShowBox(true);
    if (matrix[rowNum][colNum] === 3) {
      if (notOutDoor(rowNum + 1)) {
        setBottomRow(rowNum + 1);
        if (notOutDoor(colNum - 1)) {
          if (matrix[rowNum + 1][colNum - 1] === 0) {
            setLeftBottom(colNum - 1);
          } else {
            setLeftBottom(undefined);
            canGiveLeftBottom(rowNum + 1, colNum - 1) &&
              setKillBottomLeft(colNum - 2);
          }
        } else {
          setLeftBottom(undefined);
          setKillBottomLeft(undefined);
        }
        if (notOutDoor(colNum + 1)) {
          if (matrix[rowNum + 1][colNum + 1] === 0) {
            setRightBottom(colNum + 1);
          } else {
            setRightBottom(undefined);
            canGiveRightBotom(rowNum + 1, colNum + 1) &&
              setKillBottomRight(colNum + 2);
          }
        } else {
          setRightBottom(undefined);
          setKillBottomLeft(undefined);
        }
      } else setUndefinedBottom();
    } else setUndefinedBottom();

    if (rowNum - 1 > -1 && (colNum - 1 > -1 || colNum + 1 < 8)) {
      setNextRow(rowNum - 1);
      if (notOutDoor(colNum - 1)) {
        let leftTemp = matrix[rowNum - 1][colNum - 1];
        console.log("leftTemp", leftTemp);
        if (leftTemp == 0) setLeft(colNum - 1);
        else {
          setLeft(undefined);
          canGiveLeft(rowNum - 1, colNum - 1) && setKillLeft(colNum - 2);
        }
      } else {
        setLeft(undefined);
        setKillLeft(undefined);
      }
      if (notOutDoor(colNum + 1)) {
        let rightTemp = matrix[rowNum - 1][colNum + 1];
        if (rightTemp == 0) setRight(colNum + 1);
        else {
          setRight(undefined);
          canGiveRight(rowNum - 1, colNum + 1) && setKillRight(colNum + 2);
        }
      } else {
        setRight(undefined);
        setKillRight(undefined);
      }
    } else {
      setUndefinedTop();
    }
  };

  const canGiveLeftBottom = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum - 1) && notOutDoor(colNum - 1)) {
      if (
        matrix[rowNum + 1][colNum - 1] === 0 &&
        (matrix[rowNum][colNum] === 2 || matrix[rowNum][colNum] === 4)
      ) {
        return true;
      } else return false;
    }
  };
  const canGiveRightBotom = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum + 1) && notOutDoor(colNum + 1)) {
      if (
        matrix[rowNum + 1][colNum + 1] === 0 &&
        (matrix[rowNum][colNum] === 2 || matrix[rowNum][colNum] === 4)
      ) {
        return true;
      } else return false;
    }
  };

  const canGiveLeft = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum - 1) && notOutDoor(colNum - 1)) {
      if (
        matrix[rowNum - 1][colNum - 1] === 0 &&
        (matrix[rowNum][colNum] === 2 || matrix[rowNum][colNum] === 4)
      ) {
        return true;
      } else return false;
    }
  };
  const canGiveRight = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum - 1) && notOutDoor(colNum + 1)) {
      if (
        matrix[rowNum - 1][colNum + 1] === 0 &&
        (matrix[rowNum][colNum] === 2 || matrix[rowNum][colNum] === 4)
      ) {
        return true;
      } else return false;
    }
  };

  const goTo = (
    col: number,
    row: number,
    oldCol: number,
    toBottom?: boolean
  ) => {
    let king = false;
    setShowBox(false);
    let tempMatrix = [...matrix];
    if (!toBottom) {
      king = tempMatrix[row + 1][oldCol] === 3;
    } else king = true;
    tempMatrix[row][col] = toBottom || king ? 3 : 1;
    if (toBottom) tempMatrix[row - 1][oldCol] = 0;
    else tempMatrix[row + 1][oldCol] = 0;
    setMatrix(tempMatrix);
    setStop(true);
    setTimeout(() => {
      enemyMove();
      setStop(false);
    }, 2000);
    setUndefinedTop();
    setUndefinedBottom();
  };

  const kill = (
    col: number,
    row: number,
    oldCol: number,
    enemyCol: number,
    king?: boolean
  ) => {
    let tempMatrix = [...matrix];
    const isKing = king || tempMatrix[row + 2][oldCol] === 3;
    tempMatrix[row][col] = king || isKing ? 3 : 1;
    if (isKing) {
      tempMatrix[row - 2][oldCol] = 0;
      tempMatrix[row - 1][enemyCol] = 0;
    } else {
      tempMatrix[row + 2][oldCol] = 0;
      tempMatrix[row + 1][enemyCol] = 0;
    }
    setMatrix(tempMatrix);
    setStop(true);
    setTimeout(() => {
      enemyMove();
      setStop(false);
    }, 2000);
    setUndefinedTop();
  };

  const enemyGoTo = (
    col: number,
    row: number,
    oldCol: number,
    king?: boolean,
    toTop?: boolean
  ) => {
    let tempMatrix = [...matrix];
    tempMatrix[row][col] = king ? 4 : 2;
    if (toTop) tempMatrix[row + 1][oldCol] = 0;
    else tempMatrix[row - 1][oldCol] = 0;

    setMatrix(tempMatrix);
  };

  const enemyMove = () => {
    let flag = true;
    loop1: for (let row = 7; row > -1; row--) {
      for (let col = 7; col > -1; col--) {
        if (matrix[row][col] === 4 && notOutDoor(row - 1)) {
          if (notOutDoor(row - 1)) {
            if (notOutDoor(col - 1)) {
              if (enemyCanGiveLeftTop(row - 1, col - 1)) {
                enemyKill(col - 2, row - 2, col, col - 1, true, true);
                flag = false;
                break loop1;
              } else if (matrix[row - 1][col - 1] === 0) {
                enemyGoTo(col - 1, row - 1, col, true, true);
                flag = false;
                break loop1;
              } else if (matrix[row - 1][col + 1] === 0) {
                enemyGoTo(col + 1, row - 1, col, true, true);
                flag = false;
                break loop1;
              }
            } else if (notOutDoor(col + 1)) {
              if (enemyCanGiveRightTop(row - 1, col + 1)) {
                enemyKill(col + 2, row - 2, col, col + 1, true, true);
                flag = false;
                break loop1;
              } else if (matrix[row - 1][col + 1] === 0) {
                enemyGoTo(col + 1, row - 1, col, true, true);
                flag = false;
                break loop1;
              } else if (matrix[row - 1][col - 1] === 0) {
                enemyGoTo(col - 1, row - 1, col, true, true);
                flag = false;
                break loop1;
              }
            }
          } else if (notOutDoor(row + 1)) {
            if (notOutDoor(col - 1)) {
              if (enemyCanGiveLeft(row + 1, col - 1)) {
                enemyKill(col - 2, row + 2, col, col - 1, true);
                flag = false;
                break loop1;
              } else if (matrix[row + 1][col - 1] === 0) {
                enemyGoTo(col - 1, row + 1, col, true);
                flag = false;
                break loop1;
              } else if (matrix[row + 1][col + 1] === 0) {
                enemyGoTo(col + 1, row + 1, col, true);
                flag = false;
                break loop1;
              }
            } else if (notOutDoor(col + 1)) {
              if (enemyCanGiveRight(row + 1, col + 1)) {
                enemyKill(col + 2, row + 2, col, col + 1, true);
                flag = false;
                break loop1;
              } else if (matrix[row + 1][col + 1] === 0) {
                enemyGoTo(col + 1, row + 1, col, true);
                flag = false;
                break loop1;
              } else if (matrix[row + 1][col - 1] === 0) {
                enemyGoTo(col - 1, row + 1, col, true);
                flag = false;
                break loop1;
              }
            }
          }
        }
        if (matrix[row][col] === 2 && notOutDoor(row + 1)) {
          if (notOutDoor(col - 1)) {
            if (enemyCanGiveLeft(row + 1, col - 1)) {
              enemyKill(col - 2, row + 2, col, col - 1);
              flag = false;
              break loop1;
            } else if (matrix[row + 1][col - 1] === 0) {
              enemyGoTo(col - 1, row + 1, col);
              flag = false;
              break loop1;
            }
            if (notOutDoor(col + 1)) {
              if (enemyCanGiveRight(row + 1, col + 1)) {
                enemyKill(col + 2, row + 2, col, col + 1);
                flag = false;
                break loop1;
              } else if (matrix[row + 1][col + 1] === 0) {
                enemyGoTo(col + 1, row + 1, col);
                flag = false;
                break loop1;
              }
            }
          } else if (notOutDoor(col + 1)) {
            if (enemyCanGiveRight(row + 1, col + 1)) {
              enemyKill(col + 2, row + 2, col, col + 1);
              flag = false;
              break loop1;
            } else if (matrix[row + 1][col + 1] === 0) {
              enemyGoTo(col + 1, row + 1, col);
              flag = false;
              break loop1;
            }
            if (notOutDoor(col - 1)) {
              if (enemyCanGiveLeft(row + 1, col - 1)) {
                enemyKill(col - 2, row + 2, col, col - 1);
                flag = false;
                break loop1;
              } else if (matrix[row + 1][col - 1] === 0) {
                enemyGoTo(col - 1, row + 1, col);
                flag = false;
                break loop1;
              }
            }
          }
        }
      }
    }
    flag && setWin(true);
  };

  const enemyKill = (
    col: number,
    row: number,
    oldCol: number,
    killedCol: number,
    king?: boolean,
    toTop?: boolean
  ) => {
    let tempMatrix = [...matrix];
    tempMatrix[row][col] = king ? 4 : 2;
    if (toTop) {
      tempMatrix[row + 2][oldCol] = 0;
      tempMatrix[row + 1][killedCol] = 0;
    } else {
      tempMatrix[row - 2][oldCol] = 0;
      tempMatrix[row - 1][killedCol] = 0;
    }
    setMatrix(tempMatrix);
  };

  const enemyCanGiveLeft = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum + 1) && notOutDoor(colNum - 1)) {
      if (
        matrix[rowNum + 1][colNum - 1] === 0 &&
        (matrix[rowNum][colNum] === 1 || matrix[rowNum][colNum] === 3)
      ) {
        return true;
      } else return false;
    }
  };
  const enemyCanGiveRight = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum + 1) && notOutDoor(colNum + 1)) {
      if (
        matrix[rowNum + 1][colNum + 1] === 0 &&
        (matrix[rowNum][colNum] === 1 || matrix[rowNum][colNum] === 3)
      ) {
        return true;
      } else return false;
    }
  };
  const enemyCanGiveLeftTop = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum - 1) && notOutDoor(colNum - 1)) {
      if (
        matrix[rowNum - 1][colNum - 1] === 0 &&
        (matrix[rowNum][colNum] === 1 || matrix[rowNum][colNum] === 3)
      ) {
        return true;
      } else return false;
    }
  };
  const enemyCanGiveRightTop = (rowNum: number, colNum: number) => {
    if (notOutDoor(rowNum - 1) && notOutDoor(colNum + 1)) {
      if (
        matrix[rowNum - 1][colNum + 1] === 0 &&
        (matrix[rowNum][colNum] === 1 || matrix[rowNum][colNum] === 3)
      ) {
        return true;
      } else return false;
    }
  };

  return (
    <Fragment>
      <div
        className="page"
        style={{ pointerEvents: stop || win ? "none" : undefined }}
      >
        <div>
          powered by Amirhossein karimi & Ali Heydar
        </div>
        <div>
          Hamedan University of Technology
        </div>
        <div className="rows-wrapper">
          {[...Array(8)].map((_, rowNum) => (
            <div key={rowNum} className="cells-wrapper">
              {[...Array(8)].map((_, colNum) => (
                <div
                  key={`col${rowNum}-row${colNum}`}
                  className="cell"
                  style={{
                    backgroundColor: toggleColor(rowNum, colNum)
                      ? "burlywood"
                      : undefined,
                  }}
                >
                  <span>
                    {rowNum},{colNum}
                  </span>
                  {(matrix[rowNum][colNum] === 1 ||
                    matrix[rowNum][colNum] === 3) && (
                    <span
                      className={`soldier${matrix[rowNum][colNum]}`}
                      onClick={() => onSoldierClick(rowNum, colNum)}
                    />
                  )}
                  {(matrix[rowNum][colNum] === 2 ||
                    matrix[rowNum][colNum] === 4) && (
                    <span
                      className={`enemy-soldier${matrix[rowNum][colNum]}`}
                      onClick={() => {}}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {showBox && nextRow !== undefined && (
          <div className="question-box">
            <span className="">به کدام خانه میخواهد حرکت دهید</span>
            <div className="answer-box">
              {left !== undefined && (
                <span
                  className="answer"
                  onClick={() => goTo(left, nextRow, left + 1)}
                >
                  {nextRow},{left}
                </span>
              )}
              {right !== undefined && (
                <span
                  className="answer"
                  onClick={() => goTo(right, nextRow, right - 1)}
                >
                  {nextRow},{right}
                </span>
              )}
              {killRight !== undefined && (
                <span
                  className="answer"
                  onClick={() =>
                    kill(killRight, nextRow - 1, killRight - 2, killRight - 1)
                  }
                >
                  حریف سمت راست را نابود کن
                </span>
              )}
              {killLeft !== undefined && (
                <span
                  className="answer"
                  onClick={() =>
                    kill(killLeft, nextRow - 1, killLeft + 2, killLeft + 1)
                  }
                >
                  حریف سمت چپ را نابود کن
                </span>
              )}
            </div>
          </div>
        )}
        {/* /////////////////////////////////////////////////////////////////////////////////////// */}
        {bottomRow !== undefined && showBox && (
          <div className="question-box">
            <span>حرکات ویژه پادشاه</span>
            <div className="answer-box">
              {leftBottom !== undefined && (
                <span
                  className="answer"
                  onClick={() =>
                    goTo(leftBottom, bottomRow, leftBottom + 1, true)
                  }
                >
                  {bottomRow},{leftBottom}
                </span>
              )}
              {rightBottom !== undefined && (
                <span
                  className="answer"
                  onClick={() =>
                    goTo(rightBottom, bottomRow, rightBottom - 1, true)
                  }
                >
                  {bottomRow},{rightBottom}
                </span>
              )}
              {killBottomRight !== undefined && (
                <span
                  className="answer"
                  onClick={() =>
                    kill(
                      killBottomRight,
                      bottomRow + 1,
                      killBottomRight - 2,
                      killBottomRight - 1,
                      true
                    )
                  }
                >
                  حریف پایین سمت راست را نابود کن
                </span>
              )}
              {killBottomLeft !== undefined && (
                <span
                  className="answer"
                  onClick={() =>
                    kill(
                      killBottomLeft,
                      bottomRow + 1,
                      killBottomLeft + 2,
                      killBottomLeft + 1,
                      true
                    )
                  }
                >
                  حریف پایین سمت چپ را نابود کن
                </span>
              )}
            </div>
          </div>
        )}
        {(stop || win) && (
          <div className="wait">
            {win ? "شما پیروز شدید!" : "لطفا منتظر باشید تا حریف حرکت کند"}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Home;

const notOutDoor = (positionNumber: number) =>
  positionNumber > -1 && positionNumber < 8;
