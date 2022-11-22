

const form = document.querySelector('#formulario');
const cripto = document.querySelector('#criptomonedas');
const moneda = document.querySelector('#moneda');
const content = document.querySelector('#resultado');


window.onload = initApp;

const updateCritop = async () => {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

    try {
        // haciendo una peticion a la api por las lista de cripto de mayor valor actual
        const response = await fetch(url);
        const result = await response.json();
        // actualizando las crito monedas mas rescientes de mayor valor
        for(let i = 0 ; i < result.Data.length ; i++ )
        {
            const {CoinInfo: {Name, FullName}} = result.Data[i]
            const option = document.createElement('option');
            option.value = Name;
            option.innerText = FullName;
            cripto.appendChild(option)
        }
    } catch (error) {
        console.log(error)
    }
}
const apiRequest = async () => {
    const load = loader()
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto.value}&tsyms=${moneda.value}`

    const diVresult = document.createElement('div');

    clearContent()
    try {
        // loader
        content.appendChild(load)
        // peticion de datos a la api
        const result = await( await fetch(url)).json()
        // kill loader
        load.remove()
        // seeting el nodo con los datos de la api
        const { PRICE, LOWDAY, HIGHDAY} = result['DISPLAY'][cripto.value][moneda.value]
        diVresult.classList.add('resultados')
        diVresult.innerHTML = `
                <h2>${PRICE}</h2>
                <p>MAX: ${HIGHDAY}</p>
                <p>MIN: ${LOWDAY}</p>
        `
        // render el nodo en elemento de los resultado
        content.appendChild(diVresult);
    } catch(err)
    {
        console.log('err')
    }
}

// elelents
const loader = () => {
    const load = document.createElement('div');
    load.classList.add('spinner');
    load.innerHTML = '<div></div>'
    return load;
}
const clearContent = () => {
    while(content.firstChild)
        {
            content.firstChild.remove()
        }
}
const printNoti = (msj,type) => {
    const noti = document.createElement('div');
    noti.innerHTML = `
    <span >Notification</span>
    ${msj}
    `
    if(type == 'err')
    {
        noti.classList.add('error')
    }

    document.body.appendChild(noti)

    setTimeout(() => noti.remove(),3000)
    
}

function initApp()
{
   updateCritop()
   form.addEventListener('submit', formHandler);
}

function formHandler(event)
{
    event.preventDefault()

    // validar campos
    if( cripto.value === '' || moneda.value === '')
    {
        printNoti('todos los campos son necesarios','err')
        return
    }

    // peticion a la api

    apiRequest()
}