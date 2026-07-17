using System;

namespace HyperLocal.Helpers;

public class CategoryNotFoundException : Exception
{
    public CategoryNotFoundException(string message) : base(message)
    {
    }
}

public class DuplicateCategoryException : Exception
{
    public DuplicateCategoryException(string message) : base(message)
    {
    }
}

public class VendorNotFoundException : Exception
{
    public VendorNotFoundException(string message) : base(message)
    {
    }
}

public class DuplicateVendorException : Exception
{
    public DuplicateVendorException(string message) : base(message)
    {
    }
}
