import { useEffect } from 'react'
import { useAppDispatch } from '../../store'
import { isUserAuthenticated } from '../../store/async/userAsync'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootRoducer'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/mainComponents/Sidebar'
import ChatWindow from '../components/mainComponents/ChatWindow'
import { ProtectedRoute } from '../components/mainComponents/ProtectedRoute'
import ChatContainer from '../components/mainComponents/ChatContainer'
import SideBar from '../components/mainComponents/Sidebar'



