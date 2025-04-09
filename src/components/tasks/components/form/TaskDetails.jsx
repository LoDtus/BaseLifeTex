import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setTaskForm } from '@/redux/propertiesSlice';
import { getTaskDetailById } from '@/services/taskService';
import { Image } from "antd";
import { useState, useEffect } from "react";
import { convertDateYMD } from '@/utils/convertUtils';

export default function TaskDetails() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const taskState = useSelector((state) => state.properties.taskForm);
    const taskId = taskState.slice(0, 7).includes('DETAILS') ? taskState.slice(8) : null;
    const [task, setTask] = useState(null);

    useEffect(() => {
        if (!taskId) return setTask(null);
        async function getTaskDetails() {
            const response = await getTaskDetailById(taskId);
            setTask(response.data);
            console.log(response.data);
        }
        getTaskDetails(taskId);
    }, [taskId]);

    function closeForm() {
        // if (taskName || link || description || img) {

        // }
        dispatch(setTaskForm('CLOSE'));
    }

    return (
        <div className='z-100 fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center'>
            <div className='fixed w-[100vw] h-[100vh] bg-black opacity-30' onClick={() => closeForm()}></div>

            <div className='relative z-110 w-[80vw] h-[95vh] px-5 pb-5 flex flex-col bg-white border border-gray-border rounded-md shadow-md overflow-y-auto'>
                <div className="relative w-full pt-5 pb-3 flex justify-center sticky-top bg-white">
                    <div className='absolute top-5 right-[-30px] p-1 rounded-md cursor-pointer duration-200 hover:bg-light-gray active:scale-90'
                        onClick={() => dispatch(setTaskForm('CLOSE'))}>
                        <svg className='w-[25px] h-[25px] aspect-square'
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
                    </div>
                    <span className='text-3xl font-semibold items-center'>Chi tiết công việc</span>
                </div>
                <div className="text-[12px] mt-1 text-white font-semibold">
                    <span className="py-1 px-3 !mr-1 rounded-full bg-yellow">Yêu cầu mới</span>
                    <span className="py-1 px-3 rounded-full bg-red">Ưu tiên: Cao</span>
                </div>
                <span className='font-semibold text-2xl normal-case'>{ task?.title.trim() }</span>
                <div className='flex items-center text-[12px] text-dark-gray'>
                    <span className=''>{ convertDateYMD(task?.startDate) }</span>
                    <span className=''></span>
                    <span className='mx-2'>đến</span>
                    <span className=''>{ convertDateYMD(task?.startDate) }</span>
                    <span className=''></span>
                    <span className='text-white font-semibold !ml-2 py-[2px] px-3 rounded-full bg-red'>
                        Quá hạn
                    </span>
                    <div className='grow'></div>
                    <div>
                        
                    </div>
                </div>

                <div>
                    
                </div>

                <p className='mt-2'>
                    { task?.description }
                </p>

                <div className='w-full flex flex-col items-center mt-1 mb-3'>
                    <Image
                        className="max-w-[60vw]"
                        // src='https://i.pinimg.com/1200x/6c/e5/10/6ce5101f5f75438ee37ad894e7950d03.jpg'
                        src={ task?.image }
                        alt=''
                    />
                <span className='text-dark-gray'>Ảnh mô tả</span>
                </div>

                <div>
                    <div className="font-semibold text-2xl mb-2">Bình luận</div>
                    <div className='w-fit mb-1 flex items-center cursor-pointer duration-200 active:scale-90'>
                        <img
                            className="w-[35px] h-[35px] !mr-1 aspect-square rounded-full"
                            src="https://i.pinimg.com/1200x/02/e7/b8/02e7b8aa45cccc01ff2cb2534bbb583b.jpg"
                            alt=""
                        />
                        <div className='flex flex-col'>
                            <span className='font-semibold'>Example</span>
                            <span className='text-[12px] text-dark-gray'>example@email.com</span>
                        </div>
                    </div>
                    <div className='w-fit mt-1 !ml-9 py-2 px-3 bg-light-gray rounded-lg'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum alias dignissimos tempora. Dolorum odit et expedita iste culpa assumenda eaque accusantium ab possimus id, quibusdam error eos tenetur, atque sequi!
                    </div>
                    <div className='w-fit mt-1 !ml-9 py-2 px-3 bg-light-gray rounded-lg'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit
                    </div>
                </div>
            </div>
        </div>
    );
};