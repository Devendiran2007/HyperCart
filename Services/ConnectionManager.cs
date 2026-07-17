using HyperLocal.Interfaces;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace HyperLocal.Services;

public class ConnectionManager : IConnectionManager
{
    private readonly ConcurrentDictionary<string, HashSet<string>> _userConnections = new();

    public void AddConnection(string userId, string connectionId)
    {
        _userConnections.AddOrUpdate(userId,
            _ => new HashSet<string> { connectionId },
            (_, connections) =>
            {
                lock (connections)
                {
                    connections.Add(connectionId);
                }
                return connections;
            });
    }

    public void RemoveConnection(string connectionId)
    {
        foreach (var key in _userConnections.Keys)
        {
            if (_userConnections.TryGetValue(key, out var connections))
            {
                lock (connections)
                {
                    connections.Remove(connectionId);
                }
            }
        }
    }

    public HashSet<string> GetConnections(string userId)
    {
        if (_userConnections.TryGetValue(userId, out var connections))
        {
            lock (connections)
            {
                return new HashSet<string>(connections);
            }
        }
        return new HashSet<string>();
    }
}
