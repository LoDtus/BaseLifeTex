import { useDispatch, useSelector } from "react-redux";
import { setTaskForm } from '@/redux/propertiesSlice';
import { getTaskDetailById } from '@/services/taskService';
import { Button, Image, Input, Popover } from "antd";
import { useState, useEffect } from "react";
import { convertDateYMD } from '@/utils/convertUtils';

export default function TaskDetails() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login.currentUser.data.user);
    const taskState = useSelector((state) => state.properties.taskState);
    const taskId = taskState.slice(0, 7).includes('DETAILS') ? taskState.slice(8) : null;

    const [task, setTask] = useState(null);
    const [deadline, setDeadline] = useState(0);
    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        if (!taskId) return setTask(null);
        async function getTaskDetails() {
            const response = await getTaskDetailById(taskId);
            setTask(response.data);
        }
        getTaskDetails(taskId);
    }, [taskId]);

    useEffect(() => {
        const endDate = new Date(task?.endDate);
        const curDate = new Date();
        setDeadline(Math.ceil((endDate - curDate) / (1000 * 60 * 60 * 24)));

        task?.assigneeId.map((member) => {
            return (setMemberList((prev) => [...prev, (
                <div className="flex items-center py-1 px-2 mt-1 rounded-md cursor-pointer duration-200 hover:bg-light-gray active:scale-90">
                    <img
                        className="w-[35px] h-[35px] rounded-full aspect-square !mr-1"
                        src={member.avatar}
                        alt={member.email}
                    />
                    <div className='flex flex-col'>
                        <span className='font-semibold'>{member.userName}</span>
                        <span className='text-[12px] text-dark-gray'>{member.email}</span>
                    </div>
                </div>
            )]))
        })
    }, [task]);

    function closeForm() {
        // Thêm thông báo xác nhận khi người dùng đang bình luận dở dang
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

                <div className='flex'>
                    <div className='basis-[60%]'>
                        <div className="text-[12px] mt-1 text-white font-semibold">
                            <span className={`py-1 px-3 !mr-1 rounded-full
                                ${task?.type === 'bug' ? 'bg-red' : task?.type === 'new_request' ? 'bg-green' : 'hidden'}`}>
                                { task?.type === 'bug' ? 'Bug'
                                : task?.type === 'new_request' ? 'Yêu cầu mới' : ''}
                            </span>
                            <span className={`py-1 px-3 !mr-1 rounded-full
                                ${  task?.priority === 0 ? 'bg-green' :
                                    task?.priority === 1 ? 'bg-yellow' :
                                    task?.priority === 2 ? 'bg-red' : 'hidden'}
                            `}>Ưu tiên: {
                                task?.priority === 0 ? 'Thấp' :
                                task?.priority === 1 ? 'Trung bình' :
                                task?.priority === 2 ? 'Cao' : ''
                            }</span>
                            <span className={`py-1 px-3 rounded-full
                                ${  task?.status === 1 ? 'bg-red' :
                                    task?.status === 2 ? 'bg-yellow' :
                                    task?.status === 3 ? 'bg-blue' :
                                    task?.status === 4 ? 'bg-green' :
                                    task?.status === 5 ? 'bg-gray' :
                                    task?.status === 6 ? 'bg-gray' :
                                    task?.status === 7 ? 'bg-gray' : 'hidden'}
                            `}>{ task?.status === 1 ? 'Công việc mới' :
                                task?.status === 2 ? 'Đang thực hiện' :
                                task?.status === 3 ? 'Kiểm thử' :
                                task?.status === 4 ? 'Hoàn thành' :
                                task?.status === 5 ? 'Đóng công việc' :
                                task?.status === 6 ? 'Tạm dừng' :
                                task?.status === 7 ? 'Khóa công việc' : ''
                            }</span>
                        </div>
                        <div className='font-semibold text-3xl normal-case mt-3'>{ task?.title.trim() }</div>
                        <div className='flex items-center text-[12px] text-dark-gray'>
                            <span>{ convertDateYMD(task?.startDate) }</span>
                            <span className='mx-2'>đến</span>
                            <span>{ convertDateYMD(task?.endDate) }</span>
                            <span className={`text-white font-semibold !ml-2 py-[2px] px-3 rounded-full
                                ${deadline < 1 ? 'bg-green' : deadline > 1 ? 'bg-yellow' : deadline < 0 ? 'bg-red' : ''}`}>
                                { deadline === 0 ? `Mới`
                                : deadline > 0 ? `${Math.abs(deadline)} ngày trước`
                                : deadline < 0 ? `Quá hạn ${Math.abs(deadline)} ngày` : ''}
                            </span>
                            <div className='grow'></div>
                            <div className='flex items-center'>
                                { task?.assigneeId.map((assignee) => (
                                    <img
                                        className='w-[25px] h-[25px] !mr-1 aspect-square rounded-full cursor-pointer
                                            duration-200 active:scale-90'
                                        src={assignee.avatar}
                                        alt={assignee.email}
                                    />
                                )) }
                                <Popover placement="rightTop" title={'Thành viên'} content={memberList} trigger="click">
                                    <div className='w-[25px] h-[25px] p-1 border rounded-full flex justify-center items-center cursor-pointer duration-200 hover:bg-light-gray active:scale-90'>
                                        <svg className='w-[12px] h-[12px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/>
                                        </svg>
                                    </div>
                                </Popover>
                            </div>
                        </div>
                        
                        <div>
                        
                        </div>
                        
                        <div className='mt-3 font-semibold'>Mô tả</div>
                        <div className='text-[12px] text-dark-gray'>Đường dẫn:
                            <a href={task?.link} target="_blank" rel="noopener noreferrer" className='text-blue !ml-1'>{task?.link}</a>
                        </div>
                        <p className='py-2 px-3 border rounded-md'>
                            { task?.description }
                        </p>
                        { user?.role === 0 && <div className='w-full flex justify-end'>
                            <Button className='!font-semibold w-[100px] !mr-1' type='primary' onClick={() => dispatch(setTaskForm(`UPDATE_${taskId}`))}>Cập nhật</Button>
                            <Button className='!font-semibold w-[100px]' variant="solid" color='danger'>Xóa</Button>
                        </div> }
                    </div>
                    
                    <div className='basis-[40%] max-h-[50%] !ml-2 flex flex-col items-center mt-1 mb-3'>
                        <Image
                            className="max-w-[60vw]"
                            src={ task?.image }
                        />
                        <span className='text-dark-gray'>Ảnh mô tả</span>
                    </div>
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

                    <div className='flex items-center mt-2'>
                        <img
                            className='w-[35px] h-[35px] rounded-full !mr-1'
                            src={user?.avatar}
                            alt=''
                        />
                        <Input className='!mr-1'
                            placeholder="Bình luận"
                        />
                        <Button className='!w-[100px] !font-semibold' type='primary'>Gửi</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};