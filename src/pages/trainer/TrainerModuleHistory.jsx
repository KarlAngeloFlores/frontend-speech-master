import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import moduleService from '../../services/module.service';


const TrainerModuleHistory = () => {

    const { id } = useParams();
    const [history, setHistory] = useState([]);

    const handleModuleHistory = async (moduleId) => {
        try {
            const data = await moduleService.getModuleHistory(moduleId);
            console.log(data);
            // setHistory(data);
        } catch (error) {
            console.error('Error fetching module history:', error);
        }
    };

    useEffect(() => {
        if (id) {
            handleModuleHistory(id);
        }

    }, [id]);

  return (
    <div>TrainerModuleHistory</div>
  )
}

export default TrainerModuleHistory