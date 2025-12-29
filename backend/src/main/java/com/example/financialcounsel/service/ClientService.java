@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {
    private final ClientRepository clientRepository;

    public List<ClientVO> selectListClient(ClientVO clientVO) {
        List<ClientVO> clientList = new ArrayList<>();
    }
}