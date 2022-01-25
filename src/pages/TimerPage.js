import { useState } from "react";
import { interval } from "rxjs"; //Опреатор создающий стримы
import { map } from "rxjs/operators";
import Timer from "../components/Timer/Timer";

const TimerPage = () => {
    const delay = 1000;
    const [timer, setTimer] = useState(0);
    const [diff, setDiff] = useState(0);
    const [subscription, setSubscription] = useState("");
    const [prevent, setPrevent] = useState(true);

    const onStartHandler = () => {
        if (!subscription) {
            const timerSubscription = interval(delay)  // Вызиваем метод интервал 
                .pipe(map(timeValue => timeValue + 1)) // Метод для манипуляции сртимом. map - наиболле часто используемый оператор.Трансформирует значение timeValue, которое попадет в результирующий стрим.
                .subscribe(timeValue => {              // Подписка на стрим и получение результатов
                    setTimer(timeValue + diff);        // Передать значение diff и показать текущее значение времни. 
                });
            setSubscription(timerSubscription);
        } else {
            subscription.unsubscribe();
            setTimer(0);
            setDiff(0);
            setSubscription("");
        }
    };

    const onWaitHandler = e => {
        if (prevent) {
            setPrevent(false);
            const timerInstance = setTimeout(() => {
                setPrevent(true);
                clearTimeout(timerInstance);
            }, 300);
        } else {
            if (subscription) {
                subscription.unsubscribe();
            }
            setDiff(timer);
            setSubscription("");
        }
    };

    const onResetHandler = () => {
        if (subscription) {
            subscription.unsubscribe();
        }
        const timerSubscription = interval(delay).
            subscribe(timeValue => {
                setTimer(timeValue);
            });
        setSubscription(timerSubscription);
    };

    return (<>
        <h1>Timer</h1>
        <Timer timePassed={timer ? timer : diff} />
        <button onClick={onStartHandler} >
            Start/Stop
        </button>
        <button onClick={onWaitHandler}>
            Wait
        </button>
        <button onClick={onResetHandler}>
            Reset
        </button>
    </>
    )
}

export default TimerPage;