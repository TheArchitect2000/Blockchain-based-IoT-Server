import { DoubleSidedImage, Loading } from '@/components/shared'
import { Button, Card, Dialog, Notification, toast } from '@/components/ui'
import { apiDeleteByBuildId, apiGetBuildingsByUserId } from '@/services/UserApi'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiHome, HiPlus } from 'react-icons/hi'
import utils from './scripts/utils'

export default function BuildingPage() {
    const [buildings, setBuildings] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(0)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteData, setDeleteData] = useState<any>()
    const navigateTo = useNavigate()
    const { _id: userId } = useAppSelector((state) => state.auth.user)

    const { themeColor, themeBox } = useAppSelector((state) => state.theme)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel
    )

    function refreshPage() {
        setRefresh(refresh + 1)
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const res = (await apiGetBuildingsByUserId(userId || '')) as any
                setBuildings(res.data.data)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        fetchData()
    }, [refresh])

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    async function handleBuildingDelete() {
        setDeleteModal(false)
        setLoading(true)
        try {
            const res = await apiDeleteByBuildId(deleteData._id)
            toast.push(
                <Notification type="success">
                    {`Building ${deleteData.name} deleted successfully`}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {`Error while deleting ${deleteData.name} building`}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
        refreshPage()
    }

    return (
        <main className="w-full gap-4 flex flex-col">
            <Dialog
                closable={false}
                contentClassName="flex flex-col gap-4"
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
            >
                <h4>Delete Confirmation</h4>
                <p className="text-lg text-center text-white">
                    Are you certain about deleting {deleteData?.name} building ?
                </p>

                <div className="flex w-full justify-around">
                    <Button
                        size="sm"
                        onClick={handleBuildingDelete}
                        variant="solid"
                        color="red"
                    >
                        Delete
                    </Button>
                    <Button
                        size="sm"
                        variant="default"
                        onClick={() => setDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </Dialog>

            <div className="flex justify-between w-full">
                <h3>Manage Buildings</h3>
            </div>
            {(buildings?.length == 0 && (
                <section className="w-full h-[75dvh] flex flex-col gap-3 items-center justify-center">
                    <DoubleSidedImage
                        className="w-2/12 max-w-[250px]"
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <p className="text-center text-lg text-white">
                        No buildings were found!
                    </p>
                    <Button
                        onClick={() => {
                            navigateTo('/buildings/new')
                        }}
                        variant="solid"
                    >
                        Create New Building
                    </Button>
                </section>
            )) || (
                <section className="w-full flex gap-6 flex-wrap">
                    {buildings?.map((build, index) => {
                        const data = utils.countBuildingDetails(build)
                        return (
                            <Card
                                key={index}
                                className={`flex max-sm:flex-1 flex-col gap-1 text-white border rounded-lg`}
                            >
                                <HiHome
                                    className={`text-8xl mb-2 text-${themeColor}-${primaryColorLevel} mx-auto`}
                                />
                                <p>
                                    Name: <strong>{build.name}</strong>
                                </p>
                                <p>
                                    Floors: <strong>{data.floorCount}</strong>
                                </p>
                                <p>
                                    Units: <strong>{data.unitCount}</strong>
                                </p>
                                <p>
                                    Sensors: <strong>{data.deviceCount}</strong>
                                </p>
                                <div className="w-full mt-4 flex gap-3 justify-center">
                                    <Button
                                        size="sm"
                                        color="green"
                                        variant="solid"
                                        onClick={() => {
                                            navigateTo(
                                                `/buildings/details/${
                                                    build._id
                                                }?view=${true}` //    /buildings/${build._id}?view=${true}
                                            )
                                        }}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        className="max-lg:hidden"
                                        size="sm"
                                        color="yellow"
                                        variant="solid"
                                        onClick={() => {
                                            navigateTo(
                                                `/buildings/${build._id}`
                                            )
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="red"
                                        variant="solid"
                                        onClick={() => {
                                            setDeleteData({ ...build })
                                            setDeleteModal(true)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                    <Card
                        onClick={() => {
                            navigateTo('/buildings/new')
                        }}
                        className="flex max-lg:hidden min-h-[275px] cursor-pointer justify-center items-center px-14 text-white border rounded-lg"
                    >
                        <HiPlus className="text-5xl" />
                    </Card>
                </section>
            )}
        </main>
    )
}
