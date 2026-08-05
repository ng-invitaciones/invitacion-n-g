function iniciarCuentaRegresiva(fechaEvento) {
    const diasElemento = document.getElementById("countdown-days");
    const horasElemento = document.getElementById("countdown-hours");
    const minutosElemento = document.getElementById("countdown-minutes");
    const segundosElemento = document.getElementById("countdown-seconds");

    const fechaObjetivo = new Date(fechaEvento).getTime();

    function actualizarCuentaRegresiva() {
        const ahora = new Date().getTime();
        const diferencia = fechaObjetivo - ahora;

        if (diferencia <= 0) {
            diasElemento.textContent = "000";
            horasElemento.textContent = "00";
            minutosElemento.textContent = "00";
            segundosElemento.textContent = "00";

            return;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

        const horas = Math.floor(
            (diferencia % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutos = Math.floor(
            (diferencia % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const segundos = Math.floor(
            (diferencia % (1000 * 60)) /
            1000
        );

        diasElemento.textContent = String(dias).padStart(3, "0");
        horasElemento.textContent = String(horas).padStart(2, "0");
        minutosElemento.textContent = String(minutos).padStart(2, "0");
        segundosElemento.textContent = String(segundos).padStart(2, "0");
    }

    actualizarCuentaRegresiva();

    setInterval(actualizarCuentaRegresiva, 1000);
}