import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Brightness1Icon from "@mui/icons-material/Brightness1";

type SubscribesPopupType = {
    show: boolean
    handleClose: () => void
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `auto`,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DocumentationPopup({show, handleClose}: SubscribesPopupType) {
    return (
        <Modal
            open={show}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2><b>Основные понятия</b></h2>
                <ul>
                    <li>1. Индиктор - элемент отражающий состояние 1 метрики приложения. Всегда имеет уникальный код и
                        состояние, отражающее работоспособность. <Chip
                            style={{color: 'var(--foreground)', marginRight: '10px'}}
                            icon={<Brightness1Icon style={{color: `red`}}/>}
                            label={`phpstan`}/>
                    </li>
                    <li>2. Метрика приложения - составляющая приложения, за работоспособностью которой необходимо
                        следить.
                    </li>
                    <li>
                        3. Код индикатора - уникальный идентификатор по которому можно менять состояние индикатора.
                        Если требуется отслеживать состояние 1 метрики на разных стендах, то необходимо указать это в
                        коде.
                        <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                              icon={<Brightness1Icon style={{color: `red`}}/>}
                              label={`web-qa`}/>
                        <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                              icon={<Brightness1Icon style={{color: `green`}}/>}
                              label={`web-prod`}/>
                        Альтернативный вариант, если хочется сохранить одинаковые кода индикаторов или требуется мониторить разные стенды отдельно, то можно поднять несколько инстансов приложения на разных портах / доменах.
                        Код рекомендуется писать в kebab-case в нижнем регистре.
                    </li>
                    <li>
                        4. Состояние индикатора - это градация отражающая работоспособность метрики. Возможные варианты:
                        <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                              icon={<Brightness1Icon style={{color: `green`}}/>}
                              label={`success`}/>
                        <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                              icon={<Brightness1Icon style={{color: `yellow`}}/>}
                              label={`warning`}/>
                        <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                              icon={<Brightness1Icon style={{color: `red`}}/>}
                              label={`error`}/>
                        <Chip style={{color: 'var(--foreground)', marginRight: '10px'}}
                              icon={<Brightness1Icon style={{color: `red`, animation: 'sharp-blink 1s steps(2) infinite'}}/>}
                              label={`critical`}/>
                    </li>
                </ul>
                <h2><b>Подписчики</b></h2>
                <ul>
                    <li>1. Подписчик - пользователь приложения, имеющий теги для 1 и более индикторов.</li>
                    <li>2. Тег - код, характеризующий группу индикаторов или пользователей. Их можно использовать для связывания индикатора с пользователем</li>
                    <li>3. Групповой тег - это обычный тег записанный в формате group#tag. Например: env#prod. Для групповых тегов автоматически добавляются фильтры. Что позволяет облегчить мониторинг определенной группы индикторов.</li>
                    <li>4. User тег - это обычный тег записанный в формате user#nickname. Например: user#rinsvent. Nickname в теге сопоставляется с именем пользователя, который просматривает индикаторы и если совпадение найдено, то система будет предлагать этот индикатор пользователю.</li>
                </ul>
                <h2><b>Типы индикаторов</b></h2>
                <ul>
                    <li>1. simple - состояние меняется через апи метод.</li>
                    <li>2. ping - можно указать url адресс и time интервал опроса. Приложение будет само пинговать внешнюю систему и менять состояние индикатора</li>
                </ul>
            </Box>
        </Modal>
    );
}
