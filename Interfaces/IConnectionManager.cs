using System.Collections.Generic;

namespace HyperLocal.Interfaces;

public interface IConnectionManager
{
    void AddConnection(string userId, string connectionId);

    void RemoveConnection(string connectionId);

    HashSet<string> GetConnections(string userId);
}
